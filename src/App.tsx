
import { useEffect, useState } from 'react';
import AppShell from './components/layout/AppShell';
import HomeSection from './components/sections/HomeSection';
import ParticipantsSection from './components/sections/ParticipantsSection';
import MatchesWrapper from './components/sections/MatchesWrapper';
import RankingSection from './components/sections/RankingSection';
import RulesSection from './components/sections/RulesSection';
import { tabs } from './components/layout/navTabs';

const defaultTab = 'home';

const getTabFromHash = () => {
  const hashTab = window.location.hash.replace('#', '');
  return tabs.some((tab) => tab.id === hashTab) ? hashTab : defaultTab;
};

function App() {
  const [currentTab, setCurrentTab] = useState(getTabFromHash);

  useEffect(() => {
    const syncTabFromHash = () => setCurrentTab(getTabFromHash());

    window.addEventListener('hashchange', syncTabFromHash);
    return () => window.removeEventListener('hashchange', syncTabFromHash);
  }, []);

  const selectTab = (tab: string) => {
    setCurrentTab(tab);

    const nextHash = tab === defaultTab ? '' : `#${tab}`;
    if (window.location.hash === nextHash) return;

    window.history.pushState(null, '', `${window.location.pathname}${window.location.search}${nextHash}`);
  };

  return (
    <AppShell currentTab={currentTab} setTab={selectTab}>
      {currentTab === 'home' && <HomeSection setTab={selectTab} />}
      {currentTab === 'participants' && <ParticipantsSection />}
      {currentTab === 'matches' && <MatchesWrapper />}
      {currentTab === 'ranking' && <RankingSection />}
      {currentTab === 'rules' && <RulesSection />}
    </AppShell>
  );
}

export default App;
