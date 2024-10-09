import { openai } from '@ai-sdk/openai';
import { convertToCoreMessages, streamText } from 'ai';
import { late, z } from 'zod';
import createSupabaseServerClient from '../../../../lib/supabase/server';
import { v4 as uuid } from 'uuid';
import {
  createEmbedding,
  generateEmbedding,
  matchDocuments,
} from '../../../../lib/embedding';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai('gpt-4o'),
    messages: convertToCoreMessages(messages),
    tools: {
      saveInsight: {
        description:
          'Store valuable insights or information gathered during the conversation for future reference.',
        parameters: z.object({
          title: z.string().describe('A brief title for the insight.'),
          description: z
            .string()
            .describe('An abstract or summary of the insight.'),
          content: z
            .string()
            .describe('The content or details of the insight.'),
          emoji: z
            .string()
            .nullable()
            .describe('An emoji to represent the insight.'),
          type: z
            .enum([
              'descriptive',
              'diagnostic',
              'predictive',
              'prescriptive',
              'strategic',
              'operational',
              'customer',
              'behavioral',
              'competitive',
              'cultural',
              'innovation',
            ])
            .describe('The type or category of the insight.'),
        }),
        execute: async (insight) => {
          const supabase = await createSupabaseServerClient();
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) {
            return 'User not found';
          }
          const { error } = await supabase.from('insight').insert([
            {
              id: uuid(),
              user_id: user.id,
              ...insight,
            },
          ]);
          if (error) {
            return error.message;
          }
          return (
            'Insight saved successfully: ' +
            insight.title +
            ' - ' +
            insight.content
          );
        },
      },
      getInsights: {
        description:
          'Retrieve the insights or information gathered during the conversation.',
        parameters: z.object({
          type: z
            .enum([
              'descriptive',
              'diagnostic',
              'predictive',
              'prescriptive',
              'strategic',
              'operational',
              'customer',
              'behavioral',
              'competitive',
              'cultural',
              'innovation',
            ])
            .nullable()
            .describe(
              "Filter if you're looking for a specific type of insight.",
            ),
        }),
        execute: async ({}) => {
          const supabase = await createSupabaseServerClient();
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) {
            return 'User not found';
          }
          const { data: insights, error } = await supabase
            .from('insight')
            .select('*')
            .eq('user_id', user.id);
          if (error) {
            return error.message;
          }
          if (insights.length === 0) {
            return 'No insights found.';
          }
          return insights.map(
            insight =>
              `${insight.title} - ${insight.content} (${insight.type})`,
          ).join('\n');
        },
      },
      getThinkingModels: {
        description:
          'Retrieve a list of thinking models that can be applied to the problem at hand.',
        parameters: z.object({
          problem: z
            .string()
            .describe('The problem or challenge you are facing.'),
        }),
        execute: async ({ problem }: { problem: string }) => {
          const options = {
            method: 'POST',
            headers: {
              Authorization:
                'Bearer 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',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'llama-3.1-sonar-small-128k-online',
              messages: [
                { role: 'system', content: 'Be as detailed as possible.' },
                {
                  role: 'user',
                  content:
                    "I'm facing the following problem: " +
                    problem +
                    '. Please suggest some thinking models that can help me approach it.',
                },
              ],
              temperature: 0.2,
              top_p: 0.9,
              return_citations: true,
              search_domain_filter: ['perplexity.ai'],
              return_images: false,
              return_related_questions: false,
              search_recency_filter: 'month',
              top_k: 0,
              stream: false,
              presence_penalty: 0,
              frequency_penalty: 1,
            }),
          };

          const response = await fetch(
            'https://api.perplexity.ai/chat/completions',
            options,
          );
          const data = await response.json();

          return data.choices[0].message.content;
        },
      },
      getThinkingTechniquesBrief: {
        description:
          'Retrieve a brief overview of key thinking techniques to help you choose the most suitable one for problem-solving.',
        parameters: z.object({}),
        execute: async ({}) => {
          return [
            'Design Thinking: Human-centered approach focusing on empathy, ideation, prototyping, and testing.',
            'System Thinking: Holistic approach to understanding relationships and interactions within a system.',
            'Integrated Thinking: Combines analysis and synthesis to resolve complex and conflicting problems.',
            'Critical Thinking: Objective analysis and evaluation of an issue to form a well-reasoned judgment.',
            'Lateral Thinking: Solving problems through an indirect and creative approach, looking beyond the obvious.',
            'Divergent Thinking: Generating multiple creative solutions for an open-ended problem.',
            'Convergent Thinking: Focusing on finding a single, correct solution to a problem using logical reasoning.',
            'Intuitive Thinking: Relying on instinct and experience to make quick decisions without systematic reasoning.',
            'Logical Thinking: Analyzing information systematically based on logic and cause-effect relationships.',
            'Creative Thinking: Developing new, unique, and unconventional solutions to a problem.',
            'Meta Thinking: Reflecting on your own thinking processes to improve the quality and effectiveness of your thoughts.',
            'Analytical Thinking: Breaking down complex information into smaller components for better understanding.',
            'Holistic Thinking: Viewing problems as part of an overall system rather than in isolation, considering all interconnections.',
            'Strategic Thinking: Planning for the future by identifying goals and determining the most effective path to achieve them.',
            'Empathetic Thinking: Understanding a problem from others’ perspectives to create more human-centered solutions.',
            'Evidence-Based Thinking: Relying on data and factual evidence to form conclusions and make decisions.',
            'Causal Thinking: Identifying cause-and-effect relationships to understand the root of a problem.',
            'Pragmatic Thinking: Taking a practical approach to problem-solving, focusing on feasible and realistic solutions.',
            'Hypothetical Thinking: Exploring "what-if" scenarios to understand potential outcomes and implications.',
            'Reverse Thinking: Challenging assumptions by looking at a problem from the opposite perspective to find new possibilities.',
          ].join('\n');
        },
      },
      getThinkingTechniqueDetails: {
        description:
          'Get detailed, actionable information on a specific thinking technique, including its purpose, steps, and examples to help you apply it effectively.',
        parameters: z.object({
          technique: z
            .enum([
              'designThinking',
              'systemThinking',
              'integratedThinking',
              'criticalThinking',
              'lateralThinking',
              'divergentThinking',
              'convergentThinking',
              'intuitiveThinking',
              'logicalThinking',
              'creativeThinking',
              'metaThinking',
              'analyticalThinking',
              'holisticThinking',
              'strategicThinking',
              'empatheticThinking',
              'evidenceBasedThinking',
              'causalThinking',
              'pragmaticThinking',
              'hypotheticalThinking',
              'reverseThinking',
            ])
            .describe(
              'A specific thinking technique to get detailed information about.',
            ),
        }),
        execute: async ({
          technique,
        }: {
          technique: keyof typeof thinkingMethodsDetails;
        }) => {
          const resultString = `${
            thinkingMethodsDetails[technique].description
          }\n\nSteps:\n${thinkingMethodsDetails[technique].steps
            .map(step => `- ${step.step}: ${step.description}`)
            .join('\n')}`;
          return resultString;
        },
      },
      searchWeb: {
        description:
          'Perform a web search to gather real-time data or external resources such as trends, statistics, or competitor insights to support your analysis.',
        parameters: z.object({
          query: z
            .string()
            .describe('The topic or question you want to search for.'),
        }),
        execute: async ({ query }: { query: string }) => {
          const options = {
            method: 'POST',
            headers: {
              Authorization:
                'Bearer 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',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'llama-3.1-sonar-small-128k-online',
              messages: [
                { role: 'system', content: 'Be as detailed as possible.' },
                { role: 'user', content: query },
              ],
              temperature: 0.2,
              top_p: 0.9,
              return_citations: true,
              search_domain_filter: ['perplexity.ai'],
              return_images: false,
              return_related_questions: false,
              search_recency_filter: 'month',
              top_k: 0,
              stream: false,
              presence_penalty: 0,
              frequency_penalty: 1,
            }),
          };

          const response = await fetch(
            'https://api.perplexity.ai/chat/completions',
            options,
          );
          const data = await response.json();

          return query + ' ' + data.choices[0].message.content;
        },
      },
      addResource: {
        description: `Add new knowledge to your database. Automatically store any valuable or relevant insights provided by the user.`,
        parameters: z.object({
          title: z.string().describe('A brief title for the resource.'),
          body: z
            .string()
            .describe('The content or details of the resource to be stored.'),
        }),
        execute: async ({ title, body }) => {
          const { error } = await createEmbedding(title, body);
          if (error) {
            return error.message;
          }
          return `Resource added successfully: ${title} - ${body}`;
        },
      },
      getInformation: {
        description: `Retrieve relevant information from your knowledge base in response to user queries. This helps provide continuity and informed insights based on stored knowledge. Always call this before answering!`,
        parameters: z.object({
          question: z
            .string()
            .describe(
              'The question the user wants answered based on stored information.',
            ),
        }),
        execute: async ({ question }) => {
          const embeddedQuestion = await generateEmbedding(question);
          const { data: documents, error } = await matchDocuments(
            embeddedQuestion,
            0.5,
            3,
          );
          if (error) {
            return error.message;
          }
          if (documents.length === 0) {
            return 'I could not find any information on that topic.';
          }
          return documents.map(doc => doc.title + ' - ' + doc.body).join('\n');
        },
      },
    },
    maxSteps: 10,
    presencePenalty: 1,
  });

  return result.toDataStreamResponse();
}

const thinkingMethodsDetails = {
  designThinking: {
    description:
      'A human-centered approach focusing on empathy, ideation, prototyping, and testing.',
    steps: [
      {
        step: 'Empathize',
        description:
          'Understand the needs, emotions, and challenges of the people involved. Conduct interviews, observations, and immerse yourself in their experiences.',
      },
      {
        step: 'Define',
        description:
          'Clearly define the problem based on insights gathered during empathy. Create a problem statement that is user-focused and actionable.',
      },
      {
        step: 'Ideate',
        description:
          'Generate a broad range of creative ideas. Brainstorm without limitations to discover potential solutions.',
      },
      {
        step: 'Prototype',
        description:
          'Create simple, low-fidelity versions of your ideas to explore their feasibility. Prototypes can be sketches, models, or digital versions.',
      },
      {
        step: 'Test',
        description:
          'Test prototypes with users, gather feedback, and refine the solution. Iteratively improve based on user feedback.',
      },
    ],
  },
  systemThinking: {
    description:
      'A holistic approach to understanding the relationships and interactions within a system.',
    steps: [
      {
        step: 'Identify the System',
        description:
          'Define the boundaries of the system and identify its components, including people, processes, and external factors.',
      },
      {
        step: 'Analyze Relationships',
        description:
          'Understand how each component interacts and influences other components. Map out dependencies and flows of information.',
      },
      {
        step: 'Identify Patterns',
        description:
          'Look for recurring patterns or behaviors that indicate underlying structures. Use system dynamics tools like causal loop diagrams.',
      },
      {
        step: 'Understand Feedback Loops',
        description:
          'Identify reinforcing and balancing feedback loops within the system. Feedback can drive changes or stabilize behaviors.',
      },
      {
        step: 'Formulate Solutions',
        description:
          'Propose interventions that will improve the system’s overall performance, considering all relationships and avoiding unintended consequences.',
      },
    ],
  },
  integratedThinking: {
    description:
      'Combines analysis and synthesis to resolve complex and often conflicting problems.',
    steps: [
      {
        step: 'Define the Problem Space',
        description:
          'Understand and define all components of the problem, including differing perspectives and conflicting goals.',
      },
      {
        step: 'Identify Key Factors',
        description:
          'Identify important factors contributing to the problem and analyze their relationships, including trade-offs and tensions.',
      },
      {
        step: 'Seek Integrative Solutions',
        description:
          'Look for ways to combine opposing ideas or perspectives in innovative ways to develop more effective solutions.',
      },
      {
        step: 'Evaluate Impact',
        description:
          'Assess the impact of proposed solutions on all key stakeholders and determine if the conflicting needs are adequately balanced.',
      },
      {
        step: 'Refine and Iterate',
        description:
          'Continuously refine the solution based on feedback, seeking to balance opposing needs effectively.',
      },
    ],
  },
  criticalThinking: {
    description:
      'Objective analysis and evaluation of an issue to form a well-reasoned judgment.',
    steps: [
      {
        step: 'Identify the Issue',
        description:
          'Define the main question or problem clearly and objectively.',
      },
      {
        step: 'Gather Information',
        description:
          'Collect relevant information and evidence from credible sources to support your analysis.',
      },
      {
        step: 'Analyze Assumptions',
        description:
          'Identify assumptions that underlie arguments or perspectives and evaluate their validity.',
      },
      {
        step: 'Evaluate Evidence',
        description:
          'Assess the quality and relevance of the evidence. Look for biases, logical fallacies, or contradictions.',
      },
      {
        step: 'Form a Conclusion',
        description:
          'Draw a well-supported conclusion based on the analyzed information, considering alternative perspectives.',
      },
    ],
  },
  lateralThinking: {
    description:
      'Solving problems through an indirect and creative approach, looking beyond the obvious.',
    steps: [
      {
        step: 'Challenge Assumptions',
        description:
          'Question the existing assumptions and explore new possibilities by changing the angle of approach.',
      },
      {
        step: 'Generate Random Ideas',
        description:
          'Use random stimuli or associations to generate creative ideas. Allow your mind to wander beyond logical boundaries.',
      },
      {
        step: 'Use Provocation',
        description:
          'Make provocative statements, even if they seem irrational, to stimulate new ideas and perspectives.',
      },
      {
        step: 'Connect Ideas',
        description:
          'Look for unconventional connections between seemingly unrelated ideas to create a novel solution.',
      },
      {
        step: 'Refine Creative Solutions',
        description:
          'Evaluate the feasibility of the generated ideas and refine them into practical solutions.',
      },
    ],
  },
  divergentThinking: {
    description:
      'Generating multiple creative solutions for an open-ended problem.',
    steps: [
      {
        step: 'Define the Problem',
        description:
          'Clearly define the problem to understand the scope and boundaries of your exploration.',
      },
      {
        step: 'Brainstorm Ideas',
        description:
          'Generate as many ideas as possible, encouraging creativity without filtering or judging.',
      },
      {
        step: 'Explore Unconventional Solutions',
        description:
          'Consider alternative and non-traditional solutions, challenging the norm.',
      },
      {
        step: 'Use Visual Aids',
        description:
          'Utilize mind maps or diagrams to visualize and expand on your ideas.',
      },
      {
        step: 'List All Possibilities',
        description:
          'Compile all generated ideas, regardless of how practical they seem, for later evaluation.',
      },
    ],
  },
  convergentThinking: {
    description:
      'Focusing on finding a single, correct solution to a problem using logical reasoning.',
    steps: [
      {
        step: 'Analyze the Problem',
        description:
          'Break down the problem into smaller parts and understand the requirements.',
      },
      {
        step: 'Filter Ideas',
        description:
          'Evaluate each potential solution to determine its practicality and effectiveness.',
      },
      {
        step: 'Eliminate Unworkable Options',
        description:
          'Remove any ideas that do not meet the set criteria or that are impractical.',
      },
      {
        step: 'Select the Best Solution',
        description:
          'Choose the idea that best meets the problem requirements and is feasible.',
      },
      {
        step: 'Implement and Evaluate',
        description:
          'Apply the chosen solution and assess its effectiveness to ensure it resolves the issue.',
      },
    ],
  },
  intuitiveThinking: {
    description:
      'Relying on instinct and experience to make quick decisions without systematic reasoning.',
    steps: [
      {
        step: 'Listen to Your Gut Feeling',
        description:
          'Trust your instincts and intuition, especially when time is limited or there is no data available.',
      },
      {
        step: 'Recognize Patterns',
        description:
          'Leverage previous experiences to quickly identify familiar patterns or situations.',
      },
      {
        step: 'Act Quickly',
        description:
          'Make a decision based on your intuition without overanalyzing or second-guessing.',
      },
      {
        step: 'Reflect Afterwards',
        description:
          'Reflect on the decision to understand why it worked or didn’t work, enhancing your intuitive abilities.',
      },
    ],
  },
  logicalThinking: {
    description:
      'Analyzing information systematically based on logic and cause-effect relationships.',
    steps: [
      {
        step: 'Gather Information',
        description:
          'Collect relevant data, facts, and evidence about the problem at hand.',
      },
      {
        step: 'Identify Relationships',
        description:
          'Determine the cause-and-effect relationships between the elements involved.',
      },
      {
        step: 'Apply Logical Reasoning',
        description:
          'Use deductive or inductive reasoning to form arguments and draw conclusions.',
      },
      {
        step: 'Identify Logical Fallacies',
        description:
          'Ensure the reasoning process is free from logical errors or biases.',
      },
      {
        step: 'Draw a Conclusion',
        description:
          'Based on the logical analysis, arrive at a rational and well-supported conclusion.',
      },
    ],
  },
  creativeThinking: {
    description:
      'Developing new, unique, and unconventional solutions to a problem.',
    steps: [
      {
        step: 'Relax and Clear Your Mind',
        description:
          'Create a comfortable environment to free your mind from stress and enable creativity.',
      },
      {
        step: 'Seek Inspiration',
        description:
          'Use diverse sources of inspiration, such as nature, art, or new experiences.',
      },
      {
        step: 'Challenge Norms',
        description:
          'Question established beliefs and conventions to generate new ideas.',
      },
      {
        step: 'Brainstorm Freely',
        description:
          'Allow ideas to flow without self-censorship or judgment, encouraging originality.',
      },
      {
        step: 'Combine Ideas',
        description:
          'Merge multiple concepts to develop innovative and unique solutions.',
      },
    ],
  },
  metaThinking: {
    description:
      'Reflecting on your own thinking processes to improve the quality and effectiveness of your thoughts.',
    steps: [
      {
        step: 'Observe Your Thoughts',
        description:
          'Become aware of how you think and the influences affecting your thought process.',
      },
      {
        step: 'Identify Thinking Patterns',
        description:
          'Look for patterns, biases, and habits in your thinking, both positive and negative.',
      },
      {
        step: 'Evaluate Effectiveness',
        description:
          'Assess whether your thought processes lead to effective problem-solving or decisions.',
      },
      {
        step: 'Adjust and Adapt',
        description:
          'Modify thinking strategies that are unproductive, and reinforce those that yield results.',
      },
      {
        step: 'Apply Refined Thinking',
        description:
          'Use your insights to approach problems with improved strategies for better outcomes.',
      },
    ],
  },
  analyticalThinking: {
    description:
      'Breaking down complex information into smaller components for better understanding.',
    steps: [
      {
        step: 'Identify the Problem',
        description:
          'Define the issue clearly and break it into smaller components.',
      },
      {
        step: 'Collect Data',
        description:
          'Gather all relevant information and data regarding each component.',
      },
      {
        step: 'Analyze Relationships',
        description:
          'Determine how different components interact and influence each other.',
      },
      {
        step: 'Identify Patterns',
        description:
          'Look for trends or patterns within the data that can help explain the problem.',
      },
      {
        step: 'Draw Conclusions',
        description:
          'Synthesize the information and insights to form a logical conclusion.',
      },
    ],
  },
  holisticThinking: {
    description:
      'Viewing problems as part of an overall system rather than in isolation, considering all interconnections.',
    steps: [
      {
        step: 'Understand the Whole System',
        description:
          'Consider the entire system and how different components are interconnected.',
      },
      {
        step: 'Identify Interrelationships',
        description:
          'Understand the relationships between parts and their influence on each other.',
      },
      {
        step: 'Assess the Big Picture',
        description:
          'Consider the impact of each component on the entire system, not just isolated parts.',
      },
      {
        step: 'Develop System-Wide Solutions',
        description:
          'Create solutions that take into account all interdependencies within the system.',
      },
      {
        step: 'Monitor Changes',
        description:
          'Observe the effects of implemented changes on the system as a whole.',
      },
    ],
  },
  strategicThinking: {
    description:
      'Planning for the future by identifying goals and determining the most effective path to achieve them.',
    steps: [
      {
        step: 'Set Long-Term Goals',
        description:
          'Define clear, measurable, and achievable long-term objectives.',
      },
      {
        step: 'Analyze Current Situation',
        description:
          'Evaluate strengths, weaknesses, opportunities, and threats (SWOT analysis).',
      },
      {
        step: 'Develop Action Plans',
        description:
          'Outline specific steps needed to achieve the goals, including resources and timelines.',
      },
      {
        step: 'Assess Risks',
        description:
          'Identify potential obstacles and plan how to mitigate these risks.',
      },
      {
        step: 'Review and Adjust',
        description:
          'Continuously evaluate progress and adjust the strategy as necessary to stay on track.',
      },
    ],
  },
  empatheticThinking: {
    description:
      'Understanding a problem from others’ perspectives to create more human-centered solutions.',
    steps: [
      {
        step: 'Put Yourself in Their Shoes',
        description:
          'Imagine yourself in the position of the person facing the problem, considering their emotions and experiences.',
      },
      {
        step: 'Listen Actively',
        description:
          'Listen without interrupting, and try to understand both the spoken and unspoken emotions and needs of the person.',
      },
      {
        step: 'Ask Open-Ended Questions',
        description:
          'Ask questions that encourage the person to express their feelings and thoughts more deeply.',
      },
      {
        step: 'Validate Feelings',
        description:
          'Acknowledge and validate the emotions and concerns expressed by the person, showing empathy and understanding.',
      },
      {
        step: 'Design Solutions with Empathy',
        description:
          'Use the insights gained from empathizing to create solutions that truly address the needs and concerns of the people involved.',
      },
    ],
  },
  evidenceBasedThinking: {
    description:
      'Relying on data and factual evidence to form conclusions and make decisions.',
    steps: [
      {
        step: 'Define the Problem',
        description:
          'Clearly articulate the problem or decision that needs to be made.',
      },
      {
        step: 'Gather Evidence',
        description:
          'Collect reliable and relevant data and evidence from credible sources.',
      },
      {
        step: 'Evaluate the Evidence',
        description:
          'Assess the quality and reliability of the evidence, considering the source and potential biases.',
      },
      {
        step: 'Draw Conclusions',
        description:
          'Use the gathered evidence to draw well-supported conclusions about the problem or decision.',
      },
      {
        step: 'Make Informed Decisions',
        description:
          'Base your decisions on the evidence, ensuring they are well-supported by the data.',
      },
    ],
  },
  causalThinking: {
    description:
      'Identifying cause-and-effect relationships to understand the root of a problem.',
    steps: [
      {
        step: 'Define the Outcome',
        description:
          'Identify the outcome or problem that needs to be understood or resolved.',
      },
      {
        step: 'Identify Possible Causes',
        description:
          'Brainstorm potential causes of the problem, focusing on different contributing factors.',
      },
      {
        step: 'Analyze Relationships',
        description:
          'Determine the cause-and-effect relationships between different factors.',
      },
      {
        step: 'Use Tools for Analysis',
        description:
          'Use tools such as fishbone diagrams or the "5 Whys" method to delve deeper into the root causes.',
      },
      {
        step: 'Identify the Root Cause',
        description:
          'Pinpoint the root cause(s) that, if addressed, would prevent the problem from recurring.',
      },
    ],
  },
  pragmaticThinking: {
    description:
      'Taking a practical approach to problem-solving, focusing on feasible and realistic solutions.',
    steps: [
      {
        step: 'Define the Objective',
        description:
          'Clearly define what you want to achieve, focusing on practical and achievable goals.',
      },
      {
        step: 'Assess Constraints',
        description:
          'Identify the constraints (time, resources, budget) and ensure that the solution fits within these limits.',
      },
      {
        step: 'Generate Practical Solutions',
        description:
          'Develop solutions that are realistic and can be practically implemented within the given constraints.',
      },
      {
        step: 'Evaluate Feasibility',
        description:
          'Assess the feasibility of each solution, considering factors like cost, time, and resources.',
      },
      {
        step: 'Select and Implement',
        description:
          'Choose the most practical solution and implement it, focusing on achieving the objective efficiently.',
      },
    ],
  },
  hypotheticalThinking: {
    description:
      'Exploring "what-if" scenarios to understand potential outcomes and implications.',
    steps: [
      {
        step: 'Identify the Scenario',
        description:
          'Define the hypothetical situation or scenario that you want to explore.',
      },
      {
        step: 'Create Assumptions',
        description:
          'Develop assumptions about the scenario, ensuring they are clearly stated.',
      },
      {
        step: 'Explore Possible Outcomes',
        description:
          'Consider the potential outcomes of the scenario, thinking through different "what-if" scenarios.',
      },
      {
        step: 'Analyze Implications',
        description:
          'Assess the implications of each outcome, considering both positive and negative effects.',
      },
      {
        step: 'Draw Insights',
        description:
          'Use the analysis to draw insights that could be applied to real-world decisions or problem-solving.',
      },
    ],
  },
  reverseThinking: {
    description:
      'Challenging assumptions by looking at a problem from the opposite perspective to find new possibilities.',
    steps: [
      {
        step: 'State the Problem',
        description:
          'Define the problem or goal as it currently stands, including the assumptions being made.',
      },
      {
        step: 'Reverse the Problem',
        description:
          'Flip the problem or assumption to its opposite. For example, instead of asking how to gain more customers, ask how to lose customers.',
      },
      {
        step: 'Brainstorm Solutions',
        description:
          'Generate ideas based on the reversed statement, challenging conventional approaches.',
      },
      {
        step: 'Analyze Outcomes',
        description:
          'Identify any useful insights or alternative strategies that emerged from the reverse thinking process.',
      },
      {
        step: 'Apply Insights',
        description:
          'Incorporate the new ideas or solutions into the original problem, using them to find innovative solutions.',
      },
    ],
  },
};
