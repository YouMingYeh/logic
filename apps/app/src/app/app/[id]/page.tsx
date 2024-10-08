'use client';
import { useEffect, useState } from 'react';
import { readProfile } from '../../../modules/app/actions';
import Chat from './Chat';
import Loading from '../loading';

type Profile = {
  name: string;
};

export default function Page({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    readProfile(params.id).then(({ data, error }) => {
      console.log(error);
      if (!data) {
        return;
      }
      setProfile({
        name: data.name,
      });
    });
  }, [params.id]);

  if (!profile) {
    return <Loading />;
  }

  return (
    <div className='relative flex h-full w-full max-w-xl  md:max-w-2xl flex-col items-center justify-start gap-4 overflow-auto py-8'>
      <Chat profile={profile} />
    </div>
  );
}
