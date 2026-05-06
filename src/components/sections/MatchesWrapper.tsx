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
    <div className="relative xl:pl-16 2xl:pl-0">
      {typedUsers.length > 1 && (
        <>
          <div className="hidden xl:block xl:fixed xl:left-[max(0.5rem,calc((100vw-80rem)/2-6.5rem))] xl:top-1/2 xl:z-40 xl:-translate-y-1/2">
            <PlayerTabs users={typedUsers} activeId={activeUser} onChange={setActiveUser} profiles={profiles} placement="side" />
          </div>
          <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-3 pt-2 xl:hidden player-tabs-bottom-safe">
            <div className="player-tabs-dock pointer-events-auto mx-auto flex w-fit max-w-[calc(100vw-1.5rem)] items-center justify-center px-3 py-2">
              <PlayerTabs users={typedUsers} activeId={activeUser} onChange={setActiveUser} profiles={profiles} placement="bottom" />
            </div>
          </div>
        </>
      )}
      <MatchesSection key={activeUser} user={selectedUser} />
    </div>
  );
}
