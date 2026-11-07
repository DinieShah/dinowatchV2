import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#09090b",
          borderRadius: 32,
        }}
      >
        <svg
          width="512"
          height="512"
          viewBox="0 0 512 512"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="512" height="512" rx="32" fill="#09090b" />
          <g fill="#d97706">
            <path d="M138 322 C92 328 66 312 28 288 C62 344 96 366 146 366 Z" />
            <ellipse cx="240" cy="322" rx="128" ry="80" />
            <path d="M304 320 C300 210 322 142 366 106 L420 142 C384 182 366 242 366 320 Z" />
            <path d="M366 124 C366 96 390 74 420 74 C452 74 476 98 474 130 C473 150 459 162 435 164 L384 166 C372 166 366 154 366 140 Z" />
            <rect x="182" y="380" width="42" height="84" rx="8" />
            <rect x="286" y="380" width="42" height="84" rx="8" />
          </g>
          <circle cx="436" cy="120" r="11" fill="#09090b" />
        </svg>
      </div>
    ),
    {
      ...size,
    },
  );
}
