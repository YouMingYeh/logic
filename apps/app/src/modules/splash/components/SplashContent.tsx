export function SplashContent() {
  const randomContent = contents[Math.floor(Math.random() * contents.length)];

  return (
    <p className='text-muted-foreground max-w-[42rem] px-4 leading-normal sm:px-8 sm:text-xl sm:leading-8'>
      {randomContent}
    </p>
  );
}
const contents = [
  'Think Smarter, Solve Bigger.',
  'Empowering Leaders with Clear Thinking.',
  'Strategic Thinking for Every Challenge.',
  'Master Complex Problems, Lead with Confidence.',
  'Logic: Unlock Your Potential with Clear Thought.',
];
