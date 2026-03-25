import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import "./ImageCropper.css";

async function getCroppedBlob(imageSrc, pixelCrop, maxDimension = 1200) {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve) => { image.onload = resolve; });

  let outW = pixelCrop.width;
  let outH = pixelCrop.height;
  if (outW > maxDimension || outH > maxDimension) {
    const ratio = Math.min(maxDimension / outW, maxDimension / outH);
    outW = Math.round(outW * ratio);
    outH = Math.round(outH * ratio);
  }

  const canvas = document.createElement("canvas");
  canvas.width = outW;
  canvas.height = outH;
  canvas.getContext("2d").drawImage(
    image,
    pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
    0, 0, outW, outH
  );

  return new Promise((resolve) => canvas.toBlob(resolve, "image/webp", 0.85));
}

export default function ImageCropper({ imageSrc, aspect = 1, onDone, onCancel }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_, pixels) => {
    setCroppedAreaPixels(pixels);
  }, []);

  async function handleDone() {
    const blob = await getCroppedBlob(imageSrc, croppedAreaPixels);
    const file = new File([blob], "photo.webp", { type: "image/webp" });
    onDone(file);
  }

  return (
    <div className="img-cropper__overlay">
      <div className="img-cropper__modal">
        <p className="img-cropper__title">Recadrer la photo</p>
        <div className="img-cropper__crop-area">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
        <div className="img-cropper__controls">
          <label className="img-cropper__zoom-label">Zoom</label>
          <input
            className="img-cropper__zoom"
            type="range"
            min={1} max={3} step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
          />
          <div className="img-cropper__actions">
            <button className="img-cropper__btn img-cropper__btn--cancel" onClick={onCancel}>
              Annuler
            </button>
            <button className="img-cropper__btn img-cropper__btn--done" onClick={handleDone}>
              Valider le recadrage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
