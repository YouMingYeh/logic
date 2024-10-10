export function SplashContent() {
  const randomContent = contents[Math.floor(Math.random() * contents.length)];
  
  return (
    <p className='text-muted-foreground max-w-[42rem] px-4 leading-normal sm:px-8 sm:text-xl sm:leading-8'>
      {randomContent}
    </p>
  );
}
const contents = [
  "Think Better, Lead Better.",
  "Sharper Thinking for Smarter Decisions.",
  "Empowering Minds, Solving Challenges.",
  "Master the Art of Problem-Solving.",
  "Logic: Where Leaders Think Smarter.",
  "Elevate Your Thinking, Transform Your Leadership.",
  "From Insight to Impact.",
  "Your Partner in Strategic Thinking.",
  "Think Like a Pro, Lead Like a Pro.",
  "Decisions Backed by Logic.",
]