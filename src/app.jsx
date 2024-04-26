import React, { useState, useRef } from "react";
import "./css/app.css";
import { FloatButton, ConfigProvider } from "antd";
import { Slider, Select, Button, ColorPicker } from "antd";
import { processImages, cursors, filters } from "./hooks";
import html2canvas from "html2canvas";

import { BsThreeDots } from "react-icons/bs";
import { BiFullscreen } from "react-icons/bi";
import { MdDeleteForever } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
import { TbResize } from "react-icons/tb";

export const App = () => {
  const [images, setImages] = useState([]);
  const [boxSize, setBoxSize] = useState({ h: 4, w: 4 });
  const [boxSP, setBoxSP] = useState({ h: 4, w: 4 });
  const [itemSize, setItemSize] = useState({ h: 100, w: 100 });
  const [activeImg, setActiveImg] = useState(null);
  const [fullS, setFullS] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(true);
  const [cursor, setCursor] = useState("move");
  const [setting, setSetting] = useState(null);
  const [globalFilter, setGlobalFilter] = useState([]);
  const [color, setColor] = useState("#d3d3d3");
  const [corner, setCorner] = useState("");
  const dragStartX = useRef(0);
  const dragStartY = useRef(0);

  const updateImagesSize = (itemSize) => {
    const newImages = images.map((image) => ({
      ...image,
      ...itemSize,
    }));
    setImages(newImages);
    setItemSize(itemSize);
  };

  const addImage = (event) => {
    const files = event.target.files;
    processImages(files, itemSize, globalFilter, setImages);
  };

  const deleteImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const changeActiveImg = (i) => {
    const newIndex = activeImg + i;
    if (newIndex >= 0 && newIndex < images.length) {
      setActiveImg(newIndex);
    } else {
      setActiveImg((newIndex + images.length) % images.length);
    }
  };

  const handleDrag = (deltaX, deltaY) => {
    setImages((prevImages) =>
      prevImages.map((image, index) =>
        index === activeImg
          ? { ...image, x: image.x + deltaX, y: image.y + deltaY }
          : image
      )
    );
  };

  const handleResize = (deltaX, deltaY) => {
    setImages((prevImages) =>
      prevImages.map((image, index) => {
        if (index === activeImg) {
          let newWidth = image.w;
          let newHeight = image.h;
          let newX = image.x;
          let newY = image.y;

          if (corner === "e") {
            newWidth += deltaX;
          }
          if (corner === "w") {
            newX += deltaX;
            newWidth -= deltaX;
          }
          if (corner === "s") {
            newHeight += deltaY;
          }
          if (corner === "n") {
            newY += deltaY;
            newHeight -= deltaY;
          }
          if (corner === "ne") {
            newWidth += deltaX;
            newY += deltaY;
            newHeight -= deltaY;
          }
          if (corner === "nw") {
            newX += deltaX;
            newWidth -= deltaX;
            newY += deltaY;
            newHeight -= deltaY;
          }
          if (corner === "se") {
            newWidth += deltaX;
            newHeight += deltaY;
          }
          if (corner === "sw") {
            newX += deltaX;
            newWidth -= deltaX;
            newHeight += deltaY;
          }
          if (corner === "center") {
            newX += deltaX;
            newY += deltaY;
          }

          return { ...image, x: newX, y: newY, w: newWidth, h: newHeight };
        }
        return image;
      })
    );
  };

  const handleMouseMove = (e) => {
    if (isDragging && activeImg !== null) {
      const deltaX = e.clientX - dragStartX.current;
      const deltaY = e.clientY - dragStartY.current;
      handleDrag(deltaX, deltaY);
      dragStartX.current = e.clientX;
      dragStartY.current = e.clientY;
    } else if (isResizing && activeImg !== null) {
      const deltaX = e.clientX - dragStartX.current;
      const deltaY = e.clientY - dragStartY.current;
      handleResize(deltaX / 1.5, deltaY / 1.5);
      dragStartX.current = e.clientX;
      dragStartY.current = e.clientY;
    } else {
      return;
    }
  };

  const checkCursor = (e) => {
    if (isResizing || isDragging) return;
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const w = rect.width;
    const h = rect.height;
    const directions = {
      n: y < h / 3,
      s: y > (h / 3) * 2,
      w: x < w / 3,
      e: x > (w / 3) * 2,
      ne: y < h / 3 && x > (w / 3) * 2,
      nw: y < h / 3 && x < w / 3,
      se: y > (h / 3) * 2 && x > (w / 3) * 2,
      sw: y > (h / 3) * 2 && x < w / 3,
      center: y >= h / 3 && y <= (h / 3) * 2 && x >= w / 3 && x <= (w / 3) * 2,
    };

    const cursorDirection = Object.keys(directions).find(
      (key) => directions[key]
    );
    setCursor(cursors[cursorDirection] || "move");
    setCorner(cursorDirection);
  };

  const handleMouseDown = (e, index) => {
    if (e.button !== 0) return;
    setActiveImg(index);

    if (e.target.tagName !== "IMG") {
      setIsResizing(true);
      dragStartX.current = e.clientX;
      dragStartY.current = e.clientY;
    } else {
      setIsDragging(true);
      dragStartX.current = e.clientX;
      dragStartY.current = e.clientY;
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    setIsDragging(false);
    setActiveImg(null);
  };

  const addFilter = () => {
    if (activeImg) {
      setImages((prevImages) =>
        prevImages.map((image, index) =>
          index === activeImg
            ? {
                ...image,
                filter: [...image.filter, { value: "blur", number: 0 }],
              }
            : image
        )
      );
    } else {
      setGlobalFilter([...globalFilter, { value: "blur", number: 0 }]);
    }
  };

  const updateImagesFilter = (index, filter) => {
    setImages((prevImages) =>
      prevImages.map((image, i) => (i === index ? { ...image, filter } : image))
    );
  };

  const downloadImages = () => {
    const mainImgScreen = document.querySelector(".main-img-screen");
    html2canvas(mainImgScreen).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL();
      link.download = "collage.png";
      link.click();
    });
  };

  return (
    <div className="w100 df wrapper">
      <div
        className="df aic jcc main"
        onDoubleClick={() => setSetting(null)}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}>
        <i>screen:</i>
        <div
          className={`df fww main-img-screen ${fullS && "full-screen"}`}
          style={{
            width: boxSize.w * itemSize.w,
            height: boxSize.h * itemSize.h,
            background: color,
          }}>
          {fullS ? (
            <div className="w100 df fdc full-mode">
              <figure className="w100 df aic active-img">
                <span
                  className="df aic jcc"
                  onClick={() => changeActiveImg(-1)}>
                  <BsChevronCompactLeft />
                </span>
                <img src={images[setting]?.src} alt="Img" />
                <span
                  className="df aic jcc"
                  onClick={() => changeActiveImg(+1)}>
                  <BsChevronCompactRight />
                </span>
              </figure>
              <div className="w100 df aic jcc selected-imgs">
                {images?.map((item, ind) => (
                  <figure key={ind}>
                    <img src={item.src} alt="Edited" />
                    {setting !== ind && (
                      <i onClick={() => setActiveImg(ind)}></i>
                    )}
                  </figure>
                ))}
              </div>
              <span
                className="df aic jcc close-full-screen"
                onClick={() => setFullS(null)}>
                <RxCross2 />
              </span>
            </div>
          ) : (
            images?.map((item, ind) => (
              <figure
                className={`img-label ${activeImg === ind && "active"}`}
                key={ind}
                style={{
                  top: item.y,
                  left: item.x,
                  width: item.w,
                  height: item.h,
                  cursor: cursor,
                  zIndex: item.z,
                }}
                onMouseDown={(e) => handleMouseDown(e, ind)}
                onMouseUp={handleMouseUp}
                onMouseEnter={(e) => checkCursor(e)}
                onMouseLeave={() => setCursor("pointer")}>
                <img
                  src={item.src}
                  alt="Edited"
                  onClick={() => {
                    setActiveImg(ind);
                    setSetting(ind);
                  }}
                  style={{
                    filter: item.filter.map(
                      (filter) =>
                        `${filter.value}(${filter.number}${filter.unit})`
                    ),
                    userSelect: "none",
                  }}
                />
                <ConfigProvider
                  theme={{
                    token: {
                      controlHeightLG: 30,
                      marginXXL: 30,
                      margin: 6,
                      fontSize: 12,
                      boxShadowSecondarh:
                        "#000 0px 7px 38px, #000 0px 6px 12px;",
                    },
                  }}>
                  <FloatButton.Group
                    className={`floatBtn ${setting === ind && "active"}`}
                    trigger="click"
                    style={{ right: 0 }}
                    icon={<BsThreeDots />}>
                    <FloatButton
                      icon={<TbResize />}
                      onClick={() => setSetting(ind)}
                    />
                    <FloatButton
                      icon={<MdDeleteForever />}
                      onClick={() => deleteImage(ind)}
                    />
                    <FloatButton
                      icon={<BiFullscreen />}
                      onClick={() => setFullS(true)}
                    />
                  </FloatButton.Group>
                </ConfigProvider>
              </figure>
            ))
          )}
        </div>
      </div>
      <div className="df fdc sidebar">
        <p className="w100 title">Холст:</p>
        <div className="w100 df fdc settings">
          <label className="w100 df fdc label">
            <span>Ячеек по вертикали:</span>
            <input
              type="number"
              className="w100"
              defaultValue={boxSize.w}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setBoxSize({ ...boxSize, w: e.target.value });
                }
              }}
              onBlur={(e) => setBoxSize({ ...boxSize, w: e.target.value })}
            />
          </label>
          <label className="w100 df fdc label">
            <span>Ячеек по горизонтали:</span>
            <input
              type="number"
              className="w100"
              defaultValue={boxSize.h}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setBoxSize({ ...boxSize, h: e.target.value });
                }
              }}
              onBlur={(e) => setBoxSize({ ...boxSize, h: e.target.value })}
            />
          </label>
          <label className="w100 df aic label">
            <span>Фон:</span>{" "}
            <ColorPicker
              defaultValue={color}
              onChange={(c) => {
                setColor(c.toHexString());
              }}
              size="small"
              showText
            />
          </label>
          <label className="w100 df fww label">
            <b className="w100">Размеры ячейки (px):</b>
            <label className="df fdc label inner">
              <span>Ширина:</span>
              <input
                type="number"
                className="w100"
                defaultValue={itemSize.w}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    updateImagesSize({
                      ...itemSize,
                      w: parseInt(e.target.value, 10) || 0,
                    });
                  }
                }}
                onBlur={(e) =>
                  updateImagesSize({
                    ...itemSize,
                    w: parseInt(e.target.value, 10) || 0,
                  })
                }
              />
            </label>

            <label className="df fdc label inner">
              <span>Высота:</span>
              <input
                type="number"
                className="w100"
                defaultValue={itemSize.h}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    updateImagesSize({
                      ...itemSize,
                      h: parseInt(e.target.value, 10) || 0,
                    });
                  }
                }}
                onBlur={(e) =>
                  updateImagesSize({
                    ...itemSize,
                    h: parseInt(e.target.value, 10) || 0,
                  })
                }
              />
            </label>
          </label>
          <label className="w100 df fww label">
            <b className="w100">Размеры холста (px):</b>
            <label className="df fdc label inner">
              <span>Ширина:</span>
              <input
                type="number"
                className="w100"
                defaultValue={boxSize.w * itemSize.w}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setBoxSP({ ...boxSP, w: e.target.value });
                  }
                }}
                onBlur={(e) => setBoxSP({ ...boxSP, w: e.target.value })}
              />
            </label>
            <label className="df fdc label inner">
              <span>Высота:</span>
              <input
                type="number"
                className="w100"
                defaultValue={boxSize.h * itemSize.h}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setBoxSP({ ...boxSP, h: e.target.value });
                  }
                }}
                onBlur={(e) => setBoxSP({ ...boxSP, h: e.target.value })}
              />
            </label>
          </label>
          <label className="w100 df aic jcc select-imgs">
            <span className="df aic">
              <big>+ </big> Загрузить изображения
            </span>
            <input type="file" accept="image/*" onChange={addImage} multiple />
          </label>
          <label className="w100 df fdc filter-box">
            <span>Фильтры изображения:</span>
            <div className="w100 df fdc filters">
              {(activeImg !== null
                ? images?.[activeImg]?.filter
                : globalFilter
              )?.map((item, index) => (
                <label className="w100 df fdc filter" key={`filter-${index}`}>
                  <label className="w100 df aic">
                    <Select
                      placeholder="Выберите фильтр"
                      variant="borderless"
                      defaultValue={item.value}
                      style={{
                        flex: 1,
                      }}
                      options={filters.map((item) => ({
                        value: item.type,
                        label: `${item.label} ${item.unit}`,
                      }))}
                      onChange={(v) => {
                        const newFilters = [
                          ...(activeImg !== null ? images : globalFilter),
                        ];
                        newFilters[index].value = v;
                        newFilters[index].unit = filters.find(
                          (item) => item.type === v
                        ).unit;
                        if (activeImg !== null) {
                          updateImagesFilter(activeImg, newFilters);
                        } else {
                          setGlobalFilter(newFilters);
                        }
                      }}
                    />
                    <span
                      className="delete-filter"
                      onClick={() => {
                        const newFilters = [
                          ...(activeImg !== null ? images : globalFilter),
                        ];
                        newFilters.splice(index, 1);
                        if (activeImg !== null) {
                          updateImagesFilter(activeImg, newFilters);
                        } else {
                          setGlobalFilter(newFilters);
                        }
                      }}>
                      <RxCross2 />
                    </span>
                  </label>
                  <Slider
                    min={0}
                    max={200}
                    defaultValue={item.number}
                    onChange={(v) => {
                      const newFilters = [
                        ...(activeImg !== null ? images : globalFilter),
                      ];
                      newFilters[index].number = v;
                      if (activeImg !== null) {
                        updateImagesFilter(activeImg, newFilters);
                      } else {
                        setGlobalFilter(newFilters);
                      }
                    }}
                  />
                </label>
              ))}
            </div>
            <Button className="add-filter-btn" onClick={addFilter}>
              Добавить фильтр
            </Button>
          </label>
          {activeImg !== null && (
            <label className="w100 df fdc label">
              <span>Слой:</span>
              <input
                type="number"
                defaultValue={images[activeImg]?.z}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setImages((prevImages) =>
                      prevImages.map((image, index) =>
                        index === activeImg
                          ? { ...image, z: e.target.value }
                          : image
                      )
                    );
                  }
                }}
                onBlur={(e) =>
                  setImages((prevImages) =>
                    prevImages.map((image, index) =>
                      index === activeImg
                        ? { ...image, z: e.target.value }
                        : image
                    )
                  )
                }
              />
            </label>
          )}
          <div className="w100 df aic dowload-label">
            <input type="text" placeholder="Имя файла" />
            <Button type="primary" onClick={downloadImages}>
              Скачать
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
