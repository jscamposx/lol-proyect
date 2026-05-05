import usersData from "../../data/users.json";
import type { UserConfig } from "../../types/user";
import MatchesSection from "./MatchesSection";
import { PlayerTabs } from "../players/PlayerTabs";
import { useState } from "react";
import { useRiotProfiles } from "../../hooks/useRiotProfiles";

const typedUsers = usersData as UserConfig[];

export default function MatchesWrapper() {
  const [activeUser, setActiveUser] = useState(typedUsers[0]?.id || "");
  const profiles = useRiotProfiles(typedUsers);
  const selectedUser = typedUsers.find(u => u.id === activeUser) || typedUsers[0];

  if (!selectedUser) return <div className="text-white text-center py-20 font-bold text-2xl">No hay usuarios configurados</div>;

  return (
    <div className="relative md:pl-16 2xl:pl-0">
      {typedUsers.length > 1 && (
        <>
          <div className="hidden md:block md:fixed md:left-[max(0.5rem,calc((100vw-80rem)/2-6.5rem))] md:top-1/2 md:z-40 md:-translate-y-1/2">
            <PlayerTabs users={typedUsers} activeId={activeUser} onChange={setActiveUser} profiles={profiles} />
          </div>
          <div className="sticky top-[4.55rem] z-30 -mx-3 mb-4 border-y border-white/5 bg-[#080510]/88 px-3 py-2 backdrop-blur-xl sm:-mx-4 sm:px-4 md:hidden">
           <PlayerTabs users={typedUsers} activeId={activeUser} onChange={setActiveUser} profiles={profiles} />
          </div>
        </>
      )}
      <MatchesSection key={activeUser} user={selectedUser} />
    </div>
  );
}
