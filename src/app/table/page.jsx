import React from "react";
import Layout from "@/components/Layout";
import Table from "@/components/Table"; // ✅ no curly braces!
import Tablemonth from "@/components/Tablemonth";

function Page() {
    return (
        <Layout>
            <Tablemonth />
            {/* <Table
                data={[
                    {
                        department: "CSE",
                        classes: {
                            "SE-A": { pCount: 50, percent: 83.3 },
                            "SE-B": { pCount: 48, percent: 80.0 },
                            "TE-A": { pCount: 55, percent: 91.6 },
                            "TE-B": { pCount: 53, percent: 88.3 },
                            "BE-A": { pCount: 56, percent: 93.3 },
                            "BE-B": { pCount: 50, percent: 83.3 },
                        },
                        total: { pCount: 312, percent: 86.6 },
                    },
                ]}
            /> */}
        </Layout>
    );
}

export default Page;
