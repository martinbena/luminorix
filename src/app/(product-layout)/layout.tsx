import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="max-w-8xl mx-auto py-16 dt-xl:max-w-seventy dt-lg:p-8 dt:p-0">
      <Header />
      <main className="p-10 tab:px-6 mob:px-4 bg-white min-h-[65vh]">
        {children}
      </main>
      <Footer />
    </div>
  );
}
