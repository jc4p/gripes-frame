import HomeComponent from "@/components/HomeComponent";

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata = {
  title: "Gripes Frame",
  description: "A Frame for anonymous gripes",
  other: {
    'fc:frame': JSON.stringify({
      version: "next",
      imageUrl: `https://cover-art.kasra.codes/gripes-rectangle.png`,
      button: {
        title: "Let's hear it!",
        action: {
          type: "launch_frame",
          name: "Anonymous Gripes",
          url: process.env.NEXT_PUBLIC_APP_URL,
          splashImageUrl: `https://cover-art.kasra.codes/gripes-icon-512.png`,
          splashBackgroundColor: "#FFFFFF"
        }
      }
    })
  }
};

export default function Home() {
  return <HomeComponent />;
}
