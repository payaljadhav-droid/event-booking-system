import MyBookings from "../components/MyBookings";
import Header from "../components/Header";
import { useState } from "react";

export default function MyBookingPage() {
  const [search, setSearch] = useState("");
  return (
    <>
    <Header search={search} setSearch={setSearch}/>
    < MyBookings />
    </>
  )
}