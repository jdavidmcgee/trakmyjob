'use client';
import { useQuery } from '@tanstack/react-query';
import { getStatsAction } from '@/utils/actions';
import StatsCard from './StatsCard';

function StatsContainer() {
  const { data } = useQuery({
    queryKey: ['stats'],
    queryFn: () => getStatsAction(),
  });


  return (
    <div className='grid md:grid-cols-2 gap-4 lg:grid-cols-3'>
      <StatsCard title='applied jobs' value={data?.applied || 0} />
      <StatsCard title='interviews set' value={data?.interview || 0} />
      <StatsCard title='offers received' value={data?.offer || 0} />
      <StatsCard title='pending jobs' value={data?.pending || 0} />
      <StatsCard title='jobs declined' value={data?.declined || 0} />
      <StatsCard title='jobs rejected' value={data?.rejected || 0} />
    </div>
  );
}
export default StatsContainer;

