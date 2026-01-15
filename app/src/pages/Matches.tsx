import React, { useState, useEffect, useRef } from 'react';
import { fetchLeagueData, initialLeagueData } from '../lib/data';
import type { LeagueData } from '../types';
import { clsx } from 'clsx';
import { Calendar as CalendarIcon, Loader2, Info } from 'lucide-react';
import { Card } from '../components/Card';
import { useSearchParams } from 'react-router-dom';

export const Matches: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabsRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<LeagueData>(initialLeagueData);
  const [loading, setLoading] = useState(true);
  const [activeDivision, setActiveDivision] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetched = await fetchLeagueData();
        setData(fetched);
        
        // Initial division selection logic
        const divisions = Object.keys(fetched.matches);
        const paramDiv = searchParams.get('division');
        const defaultDiv = paramDiv && divisions.includes(paramDiv) ? paramDiv : divisions[0] || '';
        
        if (activeDivision === '' || (paramDiv && activeDivision !== paramDiv)) {
             setActiveDivision(defaultDiv);
        }
      } catch (error) {
        console.error("Failed to fetch league data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [searchParams]);

  const handleDivisionChange = (div: string) => {
    setActiveDivision(div);
    setSearchParams({ division: div });
  };

  useEffect(() => {
    if (tabsRef.current && activeDivision) {
      const activeButton = tabsRef.current.querySelector(`button[data-value="${activeDivision}"]`);
      if (activeButton) {
        activeButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeDivision, loading]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 text-brand-blue animate-spin" />
      </div>
    );
  }

  const divisions = Object.keys(data.matches);
  const matches = data.matches[activeDivision] || [];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-4xl font-heading font-bold text-brand-blue uppercase tracking-wide">
            Matches
          </h1>
          <p className="font-body text-gray-500 mt-2">Recent and upcoming games</p>
        </div>

        {/* Division Toggle */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2" ref={tabsRef}>
          {divisions.map((div) => (
            <button
              key={div}
              data-value={div}
              onClick={() => handleDivisionChange(div)}
              className={clsx(
                'px-4 py-1.5 md:px-6 md:py-2 text-xs md:text-sm font-heading font-bold uppercase tracking-wide rounded-full transition-all whitespace-nowrap',
                activeDivision === div
                  ? 'bg-brand-blue text-white shadow-md'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              )}
            >
              {div}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {matches.length > 0 ? (
          matches.map((match) => (
            <Card key={match.id} className="p-4 md:p-6 shadow-soft hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                
                {/* Date */}
                <div className="flex items-center gap-2 text-gray-400 text-xs md:text-sm font-heading font-bold uppercase tracking-wide min-w-[100px]">
                  <CalendarIcon className="w-4 h-4" />
                  {formatDate(match.date)}
                </div>

                {/* Matchup */}
                <div className="flex-1 w-full grid grid-cols-[1fr,auto,1fr] gap-4 items-center">
                  
                  {/* Team 1 */}
                  <div className={clsx(
                    "text-right flex flex-col md:flex-row items-center md:justify-end gap-2",
                    match.team1Wins > match.team2Wins ? "text-brand-blue font-bold" : "text-gray-600"
                  )}>
                    <span className="text-sm md:text-lg leading-tight">{match.team1}</span>
                    {match.team1Wins > match.team2Wins && <span className="text-brand-yellow">★</span>}
                  </div>

                  {/* Score */}
                  <div className="bg-gray-100 px-3 py-1 md:px-4 md:py-2 rounded-lg font-heading font-bold text-lg md:text-2xl text-brand-blue min-w-[80px] text-center whitespace-nowrap">
                    {match.team1Wins} - {match.team2Wins}
                  </div>

                  {/* Team 2 */}
                  <div className={clsx(
                    "text-left flex flex-col md:flex-row-reverse items-center md:justify-end gap-2",
                    match.team2Wins > match.team1Wins ? "text-brand-blue font-bold" : "text-gray-600"
                  )}>
                    <span className="text-sm md:text-lg leading-tight">{match.team2}</span>
                    {match.team2Wins > match.team1Wins && <span className="text-brand-yellow">★</span>}
                  </div>

                </div>
                
                {/* Points */}
                <div className="hidden md:flex flex-col items-center text-xs text-gray-400 font-mono">
                    <span>Points</span>
                    <span>{match.team1Points}-{match.team2Points}</span>
                </div>

              </div>
              
              {/* Mobile Points */}
              <div className="md:hidden mt-4 pt-3 border-t border-gray-100 flex justify-center text-xs text-gray-400 font-mono">
                  Points: {match.team1Points} - {match.team2Points}
              </div>

            </Card>
          ))
        ) : (
          <div className="p-16 text-center flex flex-col items-center justify-center gap-4 text-gray-400 bg-white rounded-2xl border border-gray-100">
            <div className="bg-blue-50 p-4 rounded-full">
              <Info className="w-8 h-8 text-brand-blue" />
            </div>
            <p className="font-heading font-bold text-xl text-brand-blue">No matches found</p>
            <p className="font-body text-gray-500">Check back later for the schedule!</p>
          </div>
        )}
      </div>
    </div>
  );
};
