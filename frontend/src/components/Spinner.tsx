
export default function Spinner({ size = 6 }: { size?: number }) {
  const s = `${size}rem`;
  return (
    <div className="flex items-center justify-center">
      <div
        className="animate-spin rounded-full border-4 border-t-transparent"
        style={{ width: s, height: s, borderColor: "rgba(0,0,0,0.08)", borderTopColor: "currentColor" }}
      />
    </div>
  );
}
