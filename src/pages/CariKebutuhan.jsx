import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';

/**
 * Route redirector: Cari Kebutuhan is now a premium modal on top of the Donation page.
 * Direct visits to /cari-kebutuhan or /cari-kebutuhan/:communityId seamlessly redirect to /donasi with modal opened.
 */
export default function CariKebutuhan() {
  const { communityId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/donasi', {
      replace: true,
      state: {
        openCariModal: true,
        modalCommunityId: communityId || null,
      },
    });
  }, [communityId, navigate]);

  return null;
}
