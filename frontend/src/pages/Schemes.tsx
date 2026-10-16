import React, { useState, useEffect } from 'react';
import { Calendar, ExternalLink, Info } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import api from '../services/api';
import type { Scheme } from '../types';

export const Schemes: React.FC = () => {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const response = await api.get('/schemes');
        setSchemes(response.data);
      } catch (error) {
        console.error('Failed to fetch schemes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchemes();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading schemes...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Government Schemes</h2>
        <p className="text-gray-600">Explore financial aid and subsidies available for you.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {schemes.map((scheme) => (
          <Card key={scheme.id} className="flex flex-col p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{scheme.name}</h3>
              <Badge variant="info">Active</Badge>
            </div>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
              {scheme.description}
            </p>

            <div className="space-y-3 mt-auto">
              <div className="flex items-center text-sm text-gray-500">
                <Info className="h-4 w-4 mr-2" />
                <span className="font-medium mr-1">Eligibility:</span> {scheme.eligibilityCriteria || scheme.eligibility || 'N/A'}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="font-medium mr-1">Deadline:</span> {scheme.deadline ? new Date(scheme.deadline).toLocaleDateString() : 'Open'}
              </div>
              
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => setSelectedScheme(scheme)}
              >
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={!!selectedScheme}
        onClose={() => setSelectedScheme(null)}
        title={selectedScheme?.name}
      >
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Description</h4>
            <p className="text-gray-600 text-sm">{selectedScheme?.description}</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Who can apply?</h4>
            <p className="text-gray-600 text-sm">{selectedScheme?.eligibilityCriteria || selectedScheme?.eligibility}</p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Application Deadline</h4>
            <p className="text-gray-600 text-sm">{selectedScheme?.deadline ? new Date(selectedScheme.deadline).toLocaleDateString() : 'Open'}</p>
          </div>

          <div className="pt-4 flex gap-3">
            <Button className="flex-1" onClick={() => setSelectedScheme(null)}>
              Close
            </Button>
            <Button variant="secondary" className="flex-1">
              Apply Now <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
