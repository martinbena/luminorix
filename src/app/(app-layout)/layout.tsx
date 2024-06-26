import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";

export default function MainAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="max-w-8xl mx-auto py-16 dt-xl:max-w-seventy dt-lg:p-8 dt:p-0">
      <Header />
      <div className="grid grid-cols-[minmax(250px,_2fr)_minmax(550px,_11fr)] tab:grid-cols-1">
        {children}
      </div>
      <Footer />
    </div>
  );
}
