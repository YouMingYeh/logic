'use client';

import { useEffect, useState } from 'react';
import { Button, Icons, Input, Label, useToast } from 'ui';
import createSupabaseClientClient from '../../../lib/supabase/client';
import { useRouter } from 'next/navigation';
import Loading from './loading';

type Profile = {
  name: string;
};

export default function Page() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const { push } = useRouter();
  const { toast } = useToast();

  const submit = async () => {
    if (!profile) {
      return;
    }
    setLoading(true);
    const supabase = createSupabaseClientClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return;
    }
    const { error } = await supabase.from('profile').insert([
      {
        user_id: user.id,
        name: profile?.name,
      },
    ]);
    if (error) {
      toast({ title: error.message, variant: 'destructive' });
      return;
    }

    toast({ title: 'Profile created' });
    push(`/app/${user.id}`);
    setLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      setFetching(true);
      const supabase = createSupabaseClientClient();
      const { data } = await supabase.from('profile').select().single();
      if (data) {
        push(`/app/${data.user_id}`);
        return;
      }
      setFetching(false);
    };

    fetchData();
  }, []);

  if (fetching) {
    return <Loading />;
  }

  return (
    <div className='space-y-4 p-4'>
      <h1 className='text-center text-4xl font-bold'>
        Let's setup your profile first 🚀
      </h1>
      <div>
        <Label>How should we call you?</Label>
        <Input
          value={profile?.name}
          type='text'
          onChange={e => setProfile({ name: e.target.value })}
        />
      </div>
      <Button
        className='ml-auto'
        onClick={submit}
        loading={loading}
        disabled={!profile?.name}
      >
        Submit <Icons.ChevronRight />
      </Button>
    </div>
  );
}
