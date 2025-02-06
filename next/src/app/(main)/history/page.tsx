import React from "react";
import { Headphones, Search, Sun, Target } from "lucide-react";
import { FeatureCard } from "@/components/feature";

const History = () => {
  return (
    <main className="flex-1 p-9 flex justify-center items-center flex-col">
      <div className="w-full mx-auto text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Welcome, Davis</h1>
        <p className="text-xl text-gray-500 mb-8">What's on your mind today?</p>

        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search biryani near by and at good rating"
            className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <FeatureCard
          icon={Target}
          title="Productivity Boost"
          description="Search Best place near me make me feel calm"
          iconColor="text-blue-500"
          iconBgColor="bg-blue-50"
        />
        <FeatureCard
          icon={Sun}
          title="User-Friendly Onboarding"
          description="Find Room Near me in high rating"
          iconColor="text-yellow-500"
          iconBgColor="bg-yellow-50"
        />
        <FeatureCard
          icon={Headphones}
          title="Voice Assistant"
          description="Now you can talk to get help"
          iconColor="text-pink-500"
          iconBgColor="bg-pink-50"
        />
      </div>
    </main>
  );
};

export default History;
