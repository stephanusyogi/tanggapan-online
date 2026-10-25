"use client";

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import SignaturePad from "signature_pad";

export interface SignaturePadHandle {
  clear: () => void;
  isEmpty: () => boolean;
  toDataURL: () => string;
}

interface SignaturePadComponentProps {
  initialData?: string;
  onBegin?: () => void;
  onEnd?: () => void;
  onChange?: (dataUrl: string) => void;
}

const SignaturePadComponent = forwardRef<SignaturePadHandle, SignaturePadComponentProps>(
  ({ initialData, onBegin, onEnd, onChange }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const padRef = useRef<SignaturePad | null>(null);

    const onBeginRef = useRef(onBegin);
    const onEndRef = useRef(onEnd);
    const onChangeRef = useRef(onChange);

    useEffect(() => {
      onBeginRef.current = onBegin;
      onEndRef.current = onEnd;
      onChangeRef.current = onChange;
    });

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const resizeCanvas = (preserveData = true) => {
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        const prevData = (preserveData && padRef.current && !padRef.current.isEmpty())
          ? padRef.current.toData()
          : null;

        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        const ctx = canvas.getContext("2d");
        if (ctx) ctx.scale(ratio, ratio);

        if (padRef.current) {
          padRef.current.clear();
          if (prevData) {
            padRef.current.fromData(prevData);
          }
        }
      };

      resizeCanvas(false);

      const pad = new SignaturePad(canvas, {
        backgroundColor: "rgb(255, 255, 255)",
        penColor: "rgb(0, 0, 0)",
      });

      if (initialData) {
        pad.fromDataURL(initialData);
      }

      pad.addEventListener("beginStroke", () => {
        onBeginRef.current?.();
      });

      pad.addEventListener("endStroke", () => {
        onEndRef.current?.();
        if (onChangeRef.current) {
          onChangeRef.current(pad.toDataURL());
        }
      });

      padRef.current = pad;

      const handleResize = () => {
        resizeCanvas(true);
      };
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        pad.off();
      };
    }, []);

    useImperativeHandle(ref, () => ({
      clear: () => {
        padRef.current?.clear();
        onChangeRef.current?.("");
      },
      isEmpty: () => {
        return padRef.current?.isEmpty() ?? true;
      },
      toDataURL: () => {
        return padRef.current?.toDataURL() ?? "";
      },
    }));

    return (
      <div>
        <div className="signature-container">
          <canvas ref={canvasRef} className="signature-canvas" />
        </div>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => {
            padRef.current?.clear();
            onChangeRef.current?.("");
          }}
        >
          <i className="fas fa-eraser" style={{ marginRight: 6 }} />
          Kosongkan Tanda Tangan
        </button>
      </div>
    );
  }
);

SignaturePadComponent.displayName = "SignaturePadComponent";

export default SignaturePadComponent;
