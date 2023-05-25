'use client'

import axios from "axios";
import useSWR from "swr";

import { BASEAPIURL } from "@/config";
import { getToken } from "@/utils/auth";
import Image from "next/image";
import { MdLocationPin } from "react-icons/md";

interface IParams {
  params: {
    itemId: string;
  }
}


const itemDetail = ({ params: { itemId } }: IParams) => {
  const fetcher = (url: string) => axios.get(url, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  }).then(res => res.data.data.item)

  const { data, isLoading, error } = useSWR(`${BASEAPIURL}/admin/item/${itemId}`, fetcher)

  if (isLoading) return <div>loading...</div>

  return (
    <div className="lg:flex flex-row justify-between gap-8 mt-3 bg-white w-full py-8 px-16 rounded-lg">
      <div className="w-full">
        <Image
          className="cursor-pointer"
          src={data.itemImage[0].image}
          height="400"
          width="400"
          alt="Logo"
        />
        <div className="w-full flex flex-row gap-3 my-2 overflow-x-scroll">
          {data.itemImage.map((image: any) =>
            <Image
              className="rounded-xl cursor-pointer hover:border-2 hover:border-gray-500"
              src={image.image}
              height="80"
              width="80"
              alt="Logo"
            />
          )}
        </div>
      </div>

      <div className="w-full mt-3 py-2 rounded-lg">
        <h2 className="text-2xl font-bold">{data.title.toUpperCase()}</h2>
        <div className="flex flex-row gap-5 text-md">
          <h4>Terjual <span>100</span></h4>
          <div className="flex flex-row \"> <MdLocationPin className="text-red-500" size={20} /> {data.seller.city}</div>
        </div>
        <h1 className="text-3xl font-bold mt-5">Rp{data.itemVariant[0].price}</h1>
        <div className="text-black text-lg mt-5">
          <div className="flex flex-row gap-10 mb-5">
            <div className="text-gray-700">Pilih Varian: </div>
            <div className="text-gray-700">{data.itemVariant[0].label}</div>
          </div>
          <div className="mb-5">
            {data.itemVariant.map((variant: any) =>
              <button
                onClick={() => { alert(variant.label) }}
                className="bg-white border-2 py-1 px-5 mx-1 rounded-xl">
                {variant.label}
              </button>
            )}
          </div>
          <hr />
          <div className="flex flex-row gap-10 mt-2">
            <div className="text-gray-700 text-md px-2 pb-2 hover:border-b-2">Detail</div>
            <div className="text-gray-700 text-md px-2 pb-2 hover:border-b-2">Info penting</div>
          </div>
          <hr />
          <div className="text-md text-gray-500 mt-3">
            <div className="py-0.5">Lokasi: <span className="text-black">{data.seller.city}</span></div>
            <div className="py-0.5">Stok: <span className="text-black">{data.itemVariant[0].stock}</span></div>
            <div className="py-0.5">Price: <span className="text-black">{data.itemVariant[0].price}</span></div>
            <div className="py-0.5">Penjual/Toko: <span className="text-black">{data.seller.user.username}</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default itemDetail;
