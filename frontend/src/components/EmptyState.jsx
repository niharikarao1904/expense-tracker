import { motion } from 'framer-motion';

const EmptyState = ({ icon: Icon, title, description, action }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-16 px-6"
  >
    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 flex items-center justify-center mb-6">
      <Icon className="w-10 h-10 text-primary-500" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm mb-6">{description}</p>
    {action}
  </motion.div>
);

export default EmptyState;
