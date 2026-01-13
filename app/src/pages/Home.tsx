import React from 'react';
import { leagueData } from '../lib/data';
import { Clock, Users, ArrowRight, CircleDashed } from 'lucide-react';
import { Card } from '../components/Card';
import { CircleHighlight, Underline } from '../components/Doodle';
import { useNavigate } from 'react-router-dom';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleDivisionClick = (divisionName: string) => {
    navigate(`/leaderboard?division=${encodeURIComponent(divisionName)}`);
  };

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-16 relative max-w-5xl mx-auto">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-acid/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-brand-soft-blue/50 rounded-full blur-2xl -z-10"></div>
        
        <h1 className="text-6xl md:text-8xl font-heading text-white mb-6 relative inline-block italic tracking-wider">
          WINTER <span className="text-brand-acid">2026</span>
          <CircleHighlight className="absolute -top-4 -left-8 w-[115%] h-[120%] text-brand-acid -z-10" />
        </h1>
        
        <p className="font-body text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed mt-4">
          The official <span className="font-bold text-white relative inline-block">
            Corporate Pickleball League
            <Underline className="absolute bottom-0 left-0 w-full h-3 text-brand-acid -z-10" />
          </span> portal. 
          Check schedules, smash stats, and climb the ranks.
        </p>

        <div className="mt-12">
          <button className="btn-primary text-xl">
            Find Your Team <ArrowRight className="ml-2 w-6 h-6" />
          </button>
        </div>
      </section>

      {/* Divisions Grid */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <div className="h-8 w-2 bg-brand-acid skew-x-[-10deg]"></div>
          <h2 className="text-4xl font-heading text-white italic">Divisions</h2>
          <div className="h-px flex-grow bg-white/10"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leagueData.divisions.map((div, idx) => (
            <Card 
              key={div.name} 
              className="h-full flex flex-col group cursor-pointer"
              variant={idx % 2 === 0 ? 'default' : 'blue'}
              onClick={() => handleDivisionClick(div.name)}
            >
              {/* Badge */}
              <div className="absolute -top-3 -right-3 bg-brand-acid text-brand-cream border border-white p-2 rounded-full shadow-glow group-hover:rotate-180 transition-transform duration-500 z-10">
                <CircleDashed className="w-6 h-6" />
              </div>

              <div className="mb-4">
                <h3 className="text-3xl font-heading text-white leading-none mb-3 italic">{div.name}</h3>
                <div className="flex items-center text-sm font-bold text-brand-acid bg-black/30 w-fit px-3 py-1 border border-brand-acid/30">
                  <Clock className="w-4 h-4 mr-2" />
                  {div.playTime}
                </div>
              </div>

              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-3 text-gray-400 font-mono text-sm uppercase tracking-wider">
                  <Users className="w-4 h-4" />
                  <span>{div.teams.length} Teams</span>
                </div>
                
                {div.teams.length > 0 ? (
                  <ul className="flex flex-wrap gap-2">
                    {div.teams.map((team) => (
                      <li key={team} className="text-xs font-bold bg-white/5 border border-white/10 px-2 py-1 text-gray-300 hover:text-white hover:border-brand-acid transition-colors">
                        {team}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-gray-500 text-sm italic">
                    Roster coming soon...
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};