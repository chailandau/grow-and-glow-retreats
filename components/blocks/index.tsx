import { tinaField } from "tinacms/dist/react";
import { Page, PageBlocks } from "../../tina/__generated__/types";
import { Hero } from "./hero";
import { Features } from "./features";
import { Testimonial } from "./testimonial";
import { Callout } from "./callout";
import { Stats } from "./stats";
import { Text } from "./call-to-action";
import { ImageText } from "./image-text";

export const Blocks = (props: Omit<Page, "id" | "_sys" | "_values">) => {
  if (!props.blocks) return null;
  return (
    <>
      {props.blocks.map(function (block, i) {
        return (
          <div key={i} data-tina-field={tinaField(block)}>
            <Block {...block} />
          </div>
        );
      })}
    </>
  );
};

const Block = (block: PageBlocks) => {
  switch (block.__typename) {
case "PageBlocksHero":
      return <Hero data={block} />;
    case "PageBlocksCallout":
      return <Callout data={block} />;
    case "PageBlocksStats":
      return <Stats data={block} />;
case "PageBlocksFeatures":
      return <Features data={block} />;
    case "PageBlocksTestimonial":
      return <Testimonial data={block} />;
    case "PageBlocksText":
      return <Text data={block} />;
    case "PageBlocksImageText":
      return <ImageText data={block} />;
    default:
      return null;
  }
};
