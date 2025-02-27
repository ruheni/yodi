import axios from "axios";

import Achievement from "@/components/dashboard/Achievement";
import Banner from "@/components/dashboard/Banner";
import Footer from "@/components/dashboard/Footer";
import About from "@/components/dashboard/about/About";
import Team from "@/components/dashboard/team/Team";
import Item from "@/components/dashboard/item/Item";
import ToasterProvider from '@/providers/ToasterProvider'
import Navbar from '@/components/dashboard/navbar/Navbar'
import LoginModal from '@/components/modal/LoginModal'
import RegisterModal from '@/components/modal/RegisterModal'

import { BASEURL } from "@/config";

export interface topSellerData {
  id: string;
  user: {
    image: string | null;
    username: string;
  };
  city: string;
}

const topSeller: () => Promise<topSellerData[]> = async () => {
  try {
    const response = await axios.get(`${BASEURL}/api/seller/top`);
    return response.data.data.sellers;
  } catch (error: any) {
    console.log(error);
    return []; // return an empty array in case of error
  }
}

export default async function Home() {
  const sellers = await topSeller();

  return (
    <div className="">
      <Navbar />
      <LoginModal />
      <RegisterModal />
      <ToasterProvider />
      <Banner />
      <Achievement />
      <About data={sellers} />
      <div className="bg-[#EFEB79] pt-1 pb-10 sm:px-20 lg:px-36 w-full">
        <Item />
      </div>
      <div className="bg-[#EFEB79] p-10 w-full">
        <Team />
      </div>
      <Footer />
    </div>
  )
}
