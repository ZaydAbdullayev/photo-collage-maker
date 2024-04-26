export const processImages = (files, itemSize, globalFilter, setImages) => {
  const newImages = [];
  const promises = [];
  for (let i = 0; i < files.length; i++) {
    const reader = new FileReader();
    const promise = new Promise((resolve) => {
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          newImages.push({
            src: e.target.result,
            w: itemSize.w,
            h: itemSize.h,
            x: 0,
            y: 0,
            filter: globalFilter,
            z: 1,
          });
          resolve();
        };
      };
    });
    promises.push(promise);
    reader.readAsDataURL(files[i]);
  }
  Promise.all(promises).then(() => {
    setImages((prevImages) => [...prevImages, ...newImages]);
  });
};

export const cursors = {
  n: "ns-resize",
  s: "ns-resize",
  e: "ew-resize",
  w: "ew-resize",
  ne: "nesw-resize",
  nw: "nwse-resize",
  se: "nwse-resize",
  sw: "nesw-resize",
  center: "move",
};

export const filters = [
  {
    type: "brightness",
    unit: "%",
    label: "Яркость",
  },
  {
    type: "contrast",
    unit: "%",
    label: "Контрастность",
  },
  {
    type: "saturate",
    unit: "%",
    label: "Насыщенность",
  },
  {
    type: "blur",
    unit: "px",
    label: "Размытие",
  },
  {
    type: "hue-rotate",
    unit: "deg",
    label: "hue rotation",
  },
  {
    type: "invert",
    unit: "%",
    label: "Инверсия",
  },
  {
    type: "sepia",
    unit: "%",
    label: "Сепия",
  },
  {
    type: "grayscale",
    unit: "%",
    label: "Монохромность",
  },
];

//   const handleActiveImg = (e, index) => {
//     e.preventDefault();
//     const newImages = [...images];
//     let moveEnabled = true;

//     if (e.type === "mousedown" || e.type === "touchstart") {
//       setActiveImg(index);
//       const touch = e.type === "touchstart" ? e.touches[0] : null;
//       newImages[index].startX =
//         (touch ? touch.clientX : e.clientX) - newImages[index].x;
//       newImages[index].startY =
//         (touch ? touch.clientY : e.clientY) - newImages[index].y;
//     }

//     if (activeImg !== null) {
//       if (
//         [
//           "mouseup",
//           "mouseleave",
//           "touchend",
//           "touchcancel",
//           "touchleave",
//         ].includes(e.type)
//       ) {
//         setActiveImg(null);
//       }

//       if (e.type === "mousemove" || e.type === "touchmove") {
//         const clientX =
//           e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
//         const clientY =
//           e.type === "touchmove" ? e.touches[0].clientY : e.clientY;

//         const deltaX = clientX - newImages[activeImg].startX;
//         const deltaY = clientY - newImages[activeImg].startY;

//         // Determine direction
//         const directionX = deltaX !== 0 ? (deltaX > 0 ? "e" : "w") : "";
//         const directionY = deltaY !== 0 ? (deltaY > 0 ? "s" : "n") : "";
//         const cursorDirection = directionX || directionY || "center";
//         setCursor(cursors[cursorDirection]);

//         if (moveEnabled) {
//           newImages[activeImg].x = clientX - newImages[activeImg].startX;
//           newImages[activeImg].y = clientY - newImages[activeImg].startY;
//         } else {
//           if (cursorDirection === "e") {
//             newImages[activeImg].w += deltaX;
//           } else if (cursorDirection === "w") {
//             newImages[activeImg].x += deltaX;
//             newImages[activeImg].w -= deltaX;
//           }

//           if (cursorDirection === "s") {
//             newImages[activeImg].h += deltaY;
//           } else if (cursorDirection === "n") {
//             newImages[activeImg].y += deltaY;
//             newImages[activeImg].h -= deltaY;
//           }
//         }

//         // Check if the image is within the 10px boundary
//         const isWithinBoundary =
//           newImages[activeImg].x >= 10 &&
//           newImages[activeImg].y >= 10 &&
//           newImages[activeImg].x + newImages[activeImg].w <=
//             boxSize.w * itemSize.w - 10 &&
//           newImages[activeImg].y + newImages[activeImg].h <=
//             boxSize.h * itemSize.h - 10;

//         if (!isWithinBoundary) {
//           moveEnabled = false;
//         }
//       }
//     }

//     if (e.type === "dblclick") {
//       setFullS(true);
//       setActiveImg(index);
//     }

//     if (e.type === "contextmenu") {
//       setActiveImg(index);
//     }

//     setImages(newImages);
//   };

// const handleActiveImg = (e, index) => {
//   e.preventDefault();
//   const newImages = [...images];
//   let moveEnabled = true;

//   if (e.type === "mousedown" || e.type === "touchstart") {
//     setActiveImg(index);
//     const touch = e.type === "touchstart" ? e.touches[0] : null;
//     newImages[index].startX =
//       (touch ? touch.clientX : e.clientX) - newImages[index].x;
//     newImages[index].startY =
//       (touch ? touch.clientY : e.clientY) - newImages[index].y;
//   }

//   if (activeImg !== null) {
//     if (
//       [
//         "mouseup",
//         "mouseleave",
//         "touchend",
//         "touchcancel",
//         "touchleave",
//       ].includes(e.type)
//     ) {
//       setActiveImg(null);
//     }

//     if (e.type === "mousemove" || e.type === "touchmove") {
//       const clientX =
//         e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
//       const clientY =
//         e.type === "touchmove" ? e.touches[0].clientY : e.clientY;

//       const deltaX = clientX - newImages[activeImg].startX;
//       const deltaY = clientY - newImages[activeImg].startY;
//       console.log();
//       // Yön tespiti
//       const directionX = deltaX !== 0 ? (deltaX > 0 ? "e" : "w") : "";
//       const directionY = deltaY !== 0 ? (deltaY > 0 ? "s" : "n") : "";
//       const cursorDirection = directionX || directionY || "center";
//       setCursor(cursors[cursorDirection]);

//       if (moveEnabled) {
//         newImages[activeImg].x = clientX - newImages[activeImg].startX;
//         newImages[activeImg].y = clientY - newImages[activeImg].startY;
//       } else {
//         if (cursorDirection === "e") {
//           newImages[activeImg].w += deltaX;
//         } else if (cursorDirection === "w") {
//           newImages[activeImg].x += deltaX;
//           newImages[activeImg].w -= deltaX;
//         }

//         if (cursorDirection === "s") {
//           newImages[activeImg].h += deltaY;
//         } else if (cursorDirection === "n") {
//           newImages[activeImg].y += deltaY;
//           newImages[activeImg].h -= deltaY;
//         }
//       }
//     }
//   }

//   if (e.type === "dblclick") {
//     setFullS(true);
//     setActiveImg(index);
//   }

//   if (e.type === "contextmenu") {
//     setActiveImg(index);
//   }

//   setImages(newImages);
// };

// const handleResize = (delta) => {
//   const newImages = [...images];
//   if (activeImg !== null) {
//     newImages[activeImg].w += delta;
//     newImages[activeImg].h += delta;
//   }
//   setImages(newImages);
// };

// const handleDrag = (index, deltaX, deltaY) => {
//   const newImages = [...images];
//   if (activeImg !== null) {
//     newImages[activeImg].x += deltaX;
//     newImages[activeImg].y += deltaY;
//   }
//   setImages(newImages);
// };

// const handleMouseMove = (e) => {
//   if (activeImg !== null) {
//     const deltaX = e.movementX;
//     const deltaY = e.movementY;
//     handleDrag(activeImg, deltaX, deltaY);
//   }
// };

// const handleMouseUp = () => {
//   setActiveImg(null);
// };

// const handleDoubleClick = (index) => {
//   setFullS(index);
//   setActiveImg(index);
// };
