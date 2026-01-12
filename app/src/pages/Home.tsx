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
      <section className="text-center py-12 relative max-w-4xl mx-auto">
        <div className="absolute top-0 right-10 w-20 h-20 bg-brand-acid rounded-full border-2 border-brand-ink hidden md:block"></div>
        <div className="absolute bottom-10 left-0 w-12 h-12 bg-brand-soft-blue rotate-12 border-2 border-brand-ink hidden md:block"></div>
        
        <h1 className="text-5xl md:text-7xl font-heading font-bold text-brand-ink mb-6 relative inline-block">
          WINTER 2026
          <CircleHighlight className="absolute -top-4 -left-6 w-[120%] h-[120%] text-brand-acid -z-10" />
        </h1>
        
        <p className="font-body text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
          The official <span className="font-bold relative inline-block">
            Corporate Pickleball League
            <Underline className="absolute bottom-1 left-0 w-full text-brand-orange" />
          </span> portal. 
          Check schedules, smash stats, and climb the ranks.
        </p>

        <div className="mt-10">
          <button className="btn-primary text-lg">
            Find Your Team <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Divisions Grid */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-3xl font-heading font-bold">Your Divisions</h2>
          <div className="h-0.5 flex-grow bg-brand-ink opacity-20"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {leagueData.divisions.map((div, idx) => (
            <Card 
              key={div.name} 
              className="h-full flex flex-col group cursor-pointer"
              variant={idx % 3 === 0 ? 'default' : idx % 3 === 1 ? 'default' : 'default'} // Keeping cards white for clarity
              onClick={() => handleDivisionClick(div.name)}
            >
              {/* Badge */}
              <div className="absolute -top-3 -right-3 bg-brand-acid border-2 border-brand-ink p-2 rounded-full shadow-sm rotate-3 group-hover:rotate-180 transition-transform duration-500">
                <CircleDashed className="w-5 h-5 text-brand-ink" />
              </div>

              <div className="mb-4">
                <h3 className="text-2xl font-heading font-bold text-brand-ink leading-none mb-2">{div.name}</h3>
                <div className="flex items-center text-sm font-bold text-gray-500 bg-gray-100 w-fit px-3 py-1 rounded-full border border-gray-200">
                  <Clock className="w-4 h-4 mr-2" />
                  {div.playTime}
                </div>
              </div>

              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-3 font-hand text-lg text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>{div.teams.length} Teams</span>
                </div>
                
                {div.teams.length > 0 ? (
                  <ul className="flex flex-wrap gap-2">
                    {div.teams.map((team) => (
                      <li key={team} className="text-sm font-medium bg-brand-cream border border-brand-ink/10 px-2 py-1 rounded-lg">
                        {team}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-gray-400 text-sm font-hand rotate-1">
                    No teams yet... stay tuned!
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