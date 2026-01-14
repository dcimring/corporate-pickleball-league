import React, { useEffect, useState } from 'react';
import { fetchLeagueData, initialLeagueData } from '../lib/data';
import type { LeagueData } from '../types';
import { Clock, Users, ArrowRight, Sun, Zap, Award, Coffee, Loader2 } from 'lucide-react';
import { Card } from '../components/Card';
import { useNavigate } from 'react-router-dom';
import sponsorLogo from '../assets/la roche posay 2.jpg';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<LeagueData>(initialLeagueData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetched = await fetchLeagueData();
        setData(fetched);
      } catch (error) {
        console.error("Failed to fetch league data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleDivisionClick = (divisionName: string) => {
    navigate(`/leaderboard?division=${encodeURIComponent(divisionName)}`);
  };

  const features = [
    { icon: Sun, title: "12 Shaded Courts", desc: "Suffer no sun! Beat the heat on one of 12 shaded courts." },
    { icon: Zap, title: "24 Floodlit Courts", desc: "Play late into the night with our fully illuminated facilities." },
    { icon: Award, title: "Club Tournaments", desc: "Fantastic competitions on our premium courts." },
    { icon: Coffee, title: "Bar & Restaurant", desc: "Enjoy delicious food and drinks at The Roost." },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 text-brand-blue animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto pt-10 px-4">
        
        {/* Sponsor Header */}
        <div className="flex flex-col items-center justify-center mb-10 gap-6">
           <img 
             src={sponsorLogo} 
             alt="La Roche-Posay" 
             className="h-16 md:h-24 w-auto object-contain mb-2 mix-blend-multiply"
           />
           <h2 className="text-xl md:text-2xl font-body text-gray-500 uppercase tracking-widest border-t border-b border-gray-200 py-3 px-8">
             Corporate Pickleball League
           </h2>
           <p className="font-heading font-bold text-brand-blue text-lg">JAN 12 - MAR 19, 2026</p>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl md:text-6xl font-heading font-bold text-brand-blue italic leading-tight mb-6">
          Welcome to <span className="text-brand-blue">Pickleball Cayman</span> <br/>
          <span className="text-2xl md:text-4xl not-italic font-normal text-gray-600 block mt-4">
            The World’s Largest Pickleball Club!
          </span>
        </h1>
        
        <div className="mt-12 flex justify-center gap-4">
           <button 
             onClick={() => navigate("/leaderboard")}
             className="btn-primary text-lg shadow-lg hover:scale-105 transition-transform"
           >
             View Standings
           </button>
           <button className="px-8 py-3 bg-white border-2 border-brand-blue text-brand-blue font-heading font-bold rounded-full uppercase hover:bg-blue-50 transition-colors">
             Learn More
           </button>
        </div>
      </section>

      {/* Divisions Section */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold text-brand-blue italic">Current Divisions</h2>
          <div className="h-1 w-24 bg-brand-yellow mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.divisions.map((div) => (
            <Card 
              key={div.name} 
              className="group cursor-pointer hover:-translate-y-2"
              onClick={() => handleDivisionClick(div.name)}
              title={div.name}
              variant="default"
            >
              <div className="mb-6 flex items-center gap-2">
                <span className="bg-blue-50 text-brand-blue px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center border border-blue-100">
                  <Clock className="w-3 h-3 mr-1.5" />
                  {div.playTime}
                </span>
              </div>

              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-4 text-gray-400 font-bold text-xs uppercase tracking-wider">
                  <Users className="w-4 h-4" />
                  <span>{div.teams.length} Teams Registered</span>
                </div>
                
                {div.teams.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {div.teams.map((team) => (
                      <span key={team} className="text-xs bg-gray-50 border border-gray-100 px-2 py-1 rounded text-gray-600">
                        {team}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm italic">
                    Roster coming soon...
                  </div>
                )}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-50 flex justify-end">
                 <span className="text-brand-blue font-bold text-sm group-hover:underline flex items-center">
                   View Leaderboard <ArrowRight className="w-4 h-4 ml-1" />
                 </span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Grid (Experience) */}
      <section className="bg-brand-gray -mx-4 sm:-mx-6 px-4 sm:px-6 py-20">
         <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-heading font-bold text-center text-brand-blue mb-12 italic">The Pickleball Cayman Experience</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, idx) => (
                <div key={idx} className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-soft mb-6 group-hover:scale-110 transition-transform duration-300 border border-gray-100">
                    <feature.icon className="w-8 h-8 text-brand-blue" />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-brand-blue mb-3">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed max-w-xs">{feature.desc}</p>
                </div>
              ))}
            </div>
         </div>
      </section>
    </div>
  );
};
