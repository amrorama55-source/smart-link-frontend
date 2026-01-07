import CountriesList from '../components/analytics/CountriesList';
import CitiesList from '../components/analytics/CitiesList';

export default function LocationView({ data }) {
  return (
    <div className="space-y-6">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CountriesList countries={data.countries} />
        <CitiesList cities={data.cities} />
      </div>
      
    </div>
  );
}