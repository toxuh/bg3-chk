interface Props {
  imageUrl: string;
  size?: "default" | "large";
}

export const ChecklistItemImage = ({ imageUrl, size = "default" }: Readonly<Props>) => (
  // External images are intentionally left remote in this personal tool.
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src={imageUrl}
    alt=""
    className={
      size === "large"
        ? "size-16 shrink-0 rounded-lg border border-stone-700 bg-stone-950 object-contain p-1"
        : "size-12 shrink-0 rounded-md border border-stone-700 bg-stone-950 object-contain p-1"
    }
    loading="lazy"
  />
);
