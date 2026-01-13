import React from "react";
import Layout from "@/components/Layout";
import Table from "@/components/Table"; // ✅ no curly braces!
import Tablemonth from "@/components/Tablemonth";

function Page() {
    return (
        <Layout>
            <Tablemonth />
        </Layout>
    );
}

export default Page;
