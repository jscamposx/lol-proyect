
import { useState } from 'react';
import AppShell from './components/layout/AppShell';
import HomeSection from './components/sections/HomeSection';
import ParticipantsSection from './components/sections/ParticipantsSection';
import MatchesWrapper from './components/sections/MatchesWrapper';
import RankingSection from './components/sections/RankingSection';
import RulesSection from './components/sections/RulesSection';

function App() {
  const [currentTab, setCurrentTab] = useState('home');

  return (
    <AppShell currentTab={currentTab} setTab={setCurrentTab}>
      {currentTab === 'home' && <HomeSection setTab={setCurrentTab} />}
      {currentTab === 'participants' && <ParticipantsSection />}
      {currentTab === 'matches' && <MatchesWrapper />}
      {currentTab === 'ranking' && <RankingSection />}
      {currentTab === 'rules' && <RulesSection />}
    </AppShell>
  );
}

export default App;
