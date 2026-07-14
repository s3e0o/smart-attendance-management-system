import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import DashboardCard from "../../components/ui/DashboardCard";

import {
  MdPeople,
  MdSchool,
  MdChecklist,
  MdClass,
} from "react-icons/md";

import { supabase } from "../../services/supabaseClient";

export default function Dashboard() {
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    sections: 0,
    attendanceToday: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      const [
        studentsRes,
        teachersRes,
        sectionsRes,
      ] = await Promise.all([
        supabase.from("students").select("*"),
        supabase.from("teachers").select("*"),
        supabase.from("sections").select("*"),
      ]);

      if (studentsRes.error) throw studentsRes.error;
      if (teachersRes.error) throw teachersRes.error;
      if (sectionsRes.error) throw sectionsRes.error;

      setStats({
        students: studentsRes.data.length,
        teachers: teachersRes.data.length,
        sections: sectionsRes.data.length,
        attendanceToday: 0, // we'll implement this later
      });

    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Layout>
      <h1 className="mb-8 text-3xl font-bold">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

        <DashboardCard
          title="Students"
          value={stats.students}
          icon={<MdPeople size={30} />}
          color="bg-blue-600"
        />

        <DashboardCard
          title="Teachers"
          value={stats.teachers}
          icon={<MdSchool size={30} />}
          color="bg-green-600"
        />

        <DashboardCard
          title="Attendance Today"
          value={stats.attendanceToday}
          icon={<MdChecklist size={30} />}
          color="bg-orange-500"
        />

        <DashboardCard
          title="Sections"
          value={stats.sections}
          icon={<MdClass size={30} />}
          color="bg-purple-600"
        />

      </div>
    </Layout>
  );
}