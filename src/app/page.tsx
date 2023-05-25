import axios from "axios";

import Achievement from "@/components/dashboard/Achievement";
import Banner from "@/components/dashboard/Banner";
import Footer from "@/components/dashboard/Footer";
import About from "@/components/dashboard/about/About";
import Team from "@/components/dashboard/team/Team";
import Navbar from '@/components/dashboard/navbar/Navbar'

import ClientOnly from "@/components/ClientOnly";
import Item from "@/components/dashboard/item/Item";

const topSeller = async () => {
  try {
    const response = await axios.get(`api/seller/top`);
    return response.data.data.sellers;
  } catch (error: any) {
    console.log(error.message);
    return []; // return an empty array in case of error
  }
}

export default async function Home() {
  const sellers = await topSeller();

  return (
    <div className="">
      <ClientOnly>
        <Navbar />
        <Banner />
        <Achievement />
        <About data={sellers} />
        <div className="bg-[#EFEB79] p-10 w-full">
          <Item />
        </div>
        <div className="bg-[#EFEB79] p-10 w-full">
          <Team />
        </div>
        <Footer />
      </ClientOnly>
    </div>
  )
}
