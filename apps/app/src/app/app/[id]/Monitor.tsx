import { AnimatedCircularProgressBar } from 'ui';
import { motion } from 'framer-motion';

export default function Monitor() {
  return (
    <motion.div className='relative w-full p-4 self-center h-[60vh]' initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}>
      <AnimatedCircularProgressBar
        gaugePrimaryColor='#F97315'
        gaugeSecondaryColor='rgba(0, 0, 0, 0.1)'
        max={12}
        min={0}
        value={3}
        label='習慣任務'
        className='w-1/2 m-auto'
      />
    </motion.div>
  );
}
