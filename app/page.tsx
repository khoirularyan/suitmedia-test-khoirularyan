'use client';

import { Banner } from "@/component/banner";
import { Header } from "@/component/header";
import { List } from "@/component/list"; 

export default function HomePage() {
  
    return (
        <div className="min-h-screen">
            <Header />
            <Banner />
            <List />
        </div>
    );
}