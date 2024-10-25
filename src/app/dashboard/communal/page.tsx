import Navbar from "@/components/molecules/navbar/NavBar";
import ListCommunalTransaction from "@/components/organism/dashboard/ListCommunalTransaction";

export default function CommunalDashboard() {
  return (
    <div>
      <Navbar></Navbar>
      <section className="m-10">
        <ListCommunalTransaction />
      </section>
    </div>
  );
}
