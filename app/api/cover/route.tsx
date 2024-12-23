import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { Lato } from "next/font/google";

// Import style components
import Uno from "@/components/image-styles/Uno";
import Dos from "@/components/image-styles/Dos";
import Tres from "@/components/image-styles/Tres";
import DefaultStyle from "@/components/image-styles/DefaultStyle";
import MinimalStyle from "@/components/image-styles/MinimalStyle";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  // Extract query parameters
  const articleTitle = url.searchParams.get("t") || url.searchParams.get("title");
  const titleSize = parseInt(url.searchParams.get("ts") || url.searchParams.get("titleSize") || "70", 10);
  const titleWeight = url.searchParams.get("tw") || url.searchParams.get("titleWeight") || "900";
  const titleLineHeight = url.searchParams.get("tlh") || url.searchParams.get("titleLineHeight") || "1.6";

  const articleDesc = url.searchParams.get("d") || url.searchParams.get("desc");
  const descriptionSize = parseInt(url.searchParams.get("ds") || url.searchParams.get("descriptionSize") || "40", 10);
  const descriptionWeight = url.searchParams.get("dw") || url.searchParams.get("descriptionWeight") || "900";
  const descriptionLineHeight = url.searchParams.get("dlh") || url.searchParams.get("descriptionLineHeight") || "1.6";

  const imageWidth = parseInt(url.searchParams.get("w") || url.searchParams.get("width") || "1200", 10);
  let imageHeight = parseInt(url.searchParams.get("h") || url.searchParams.get("height") || "630", 10);
  const aspectRatio = url.searchParams.get("ar") || url.searchParams.get("aspectRatio");

  if (aspectRatio) {
    const [width, height] = aspectRatio.split(":").map(Number);
    imageHeight = (imageWidth * height) / width;
  }

  let style = url.searchParams.get("s") || url.searchParams.get("style") || "default";

  // Validate required parameters
  if (!articleTitle) {
    return new ImageResponse(<>Oops! Invalid params.</>, {
      width: imageWidth,
      height: imageHeight,
    });
  }
  
  // const latoBlack = await fetch(
  //   new URL("@/assets/fonts/Lato-Black.ttf", import.meta.url)
  // ).then((res) => res.arrayBuffer());

  // Style component mapping
  const STYLE_COMPONENTS = {
    default: DefaultStyle,
    minimal: MinimalStyle,
    uno: Uno,
    dos: Dos,
    tres: Tres,
  };
  // Select a random style if requested
  if (style === "r" || style === "random") {
    const styleKeys = Object.keys(STYLE_COMPONENTS);
    const randomIndex = Math.floor(Math.random() * styleKeys.length);
    style = styleKeys[randomIndex];
  }
  // Determine the appropriate style component based on the 'style' parameter
  const StyleComponent = STYLE_COMPONENTS[style.toLowerCase()] || DefaultStyle;
  // Generate the image content with the selected style component
  const content = (
    <StyleComponent 
      title={articleTitle} 
      titleSize={titleSize} 
      titleWeight={titleWeight} 
      titleLineHeight={titleLineHeight} 
      description={articleDesc} 
      descriptionSize={descriptionSize} 
      descriptionWeight={descriptionWeight} 
      descriptionLineHeight={descriptionLineHeight} 
    />
  );
  // Return the image response with the generated content and font configuration
  return new ImageResponse(content, {
    width: imageWidth,
    height: imageHeight,
  });
}
