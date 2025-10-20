import Layout from '../components/Layout';
import Classes from '../components/Classes';
import Fill from '../components/Fill';
import Table from '../components/Table';
export default function Home() {
  const attendanceData = [
    {
      department: "Computer Engg",
      classes: {
        "SE-A": { pCount: 77, percent: 100 },
        "SE-B": { pCount: 79, percent: 100 },
        "TE-A": { pCount: 18, percent: 25.35 },
        "TE-B": { pCount: 19, percent: 28.79 },
        "BE-A": { pCount: 10, percent: 15.15 },
        "BE-B": { pCount: 0, percent: 0 },
      },
      total: { pCount: 203, percent: 59.53 }
    },
    {
      department: "Mechanical Engg",
      classes: {
        "SE-A": { pCount: 31, percent: 50 },
        "SE-B": { pCount: 34, percent: 72.34 },
        "TE-A": { pCount: 35, percent: 55.56 },
        "TE-B": { pCount: 0, percent: 0 },
        "BE-A": { pCount: 0, percent: 0 },
        "BE-B": { pCount: 0, percent: 0 },
      },
      total: { pCount: 100, percent: 42.74 }
    },

  ];

  return (

    <Layout>
      {/* <Table data={attendanceData} /> */}
      <Classes/>
    </Layout>
  );
}
