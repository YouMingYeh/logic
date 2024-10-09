'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { v4 as uuid } from 'uuid';
import { marked } from 'marked';

type Profile = {
  name: string;
};

interface ChatProps {
  profile: Profile;
}

export default function Chat({ profile }: ChatProps) {
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createSupabaseClientClient();
    const fetchMessages = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return;
      }
      const { data: messages, error } = await supabase
        .from('message')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(30);
      if (error) {
        console.error(error);
        return;
      }
      const reversedMessages = messages.reverse();

      setInitialMessages(
        reversedMessages.map((m: any) => ({
          id: m.id,
          content: m.content,
          role: m.role,
          createdAt: new Date(m.created_at),
          experimental_attachments: m.experimental_attachments
            ?.split(',')
            .map((attachment: string) => {
              const [name, contentType, url] = attachment.split(':');
              return { name, contentType, url };
            }),
          name: m.name,
          data: m.data,
        })),
      );
      setLoading(false);
    };
    void fetchMessages();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className='flex h-full w-full flex-col justify-start overflow-auto'
    >
      {loading ? (
        <div className='flex h-full w-full items-center justify-center'>
          <Icons.Spinner className='text-primary h-8 w-8 animate-spin' />
        </div>
      ) : (
        <AI profile={profile} initialMessages={initialMessages} />
      )}
      <Config />
      <InsightCards />
    </motion.div>
  );
}

import { ToolInvocation } from 'ai';
import { Message, useChat } from 'ai/react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  cn,
  Emoji,
  Icons,
  Input,
  Label,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Textarea,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useToast,
} from 'ui';
import {
  ChangeEvent,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import createSupabaseClientClient from '../../../../lib/supabase/client';
import Image from 'next/image';
import {
  createEmbedding,
  deleteDocument,
  getDocuments,
} from '../../../../lib/embedding';
import CopyButton from '../../../components/other/copy-button';
import ReloadButton from '../../../components/other/reload-button';

function AI({
  profile,
  initialMessages,
}: {
  profile: Profile;
  initialMessages: Message[];
}) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    addToolResult,
    isLoading,
    reload,
    setInput,
    append,
  } = useChat({
    maxSteps: 10,
    // run client-side tools that are automatically executed:
    async onToolCall({ toolCall }) {
      console.log(toolCall.toolName);
    },
    initialMessages: [
      ...initialMessages,
      {
        id: uuid(),
        role: 'system',
        content: `
**Role**: You are an AI Strategic Thinking Coach, designed to assist top-level executives, entrepreneurs, and decision-makers in cultivating a strategic problem-solving mindset. Your role is to lead users through advanced analytical thinking, fostering their ability to create innovative strategies and solutions for complex business challenges without directly providing answers or unnecessary complexity.

### Core Responsibilities:
1. **Context Continuity**: Always retrieve relevant prior discussions, insights, or stored knowledge using the **"getInformation"** tool to ensure continuity. This is essential for maintaining a complete understanding of the user’s business landscape and strategic objectives.

2. **Guiding High-Level Strategic Thinking**: Instead of asking questions, guide the user through sophisticated reflection and strategic thought processes. Introduce advanced concepts, frameworks, and **problem reframing techniques** to help them view their challenges from new perspectives. Your goal is to help them **identify key factors** (who, what, why, when, how) and discover new strategies.

3. **Structured, High-Level Analysis**:
   - Utilize a **Chain of Thought** methodology, breaking down complex business issues into manageable parts. Begin by addressing core elements such as market dynamics, stakeholders, opportunities, and risks, then gradually guide the user toward broader strategic implications.
   - **Problem Reframing**: Use problem reframing techniques to redefine challenges in a way that opens up new avenues for solutions. Help the user look at their problems through different lenses, expanding their understanding by reframing "what" the problem truly is and "how" it can be addressed creatively.

4. **Utilization of Advanced Strategic Models and Tools**:
   - Use **"getThinkingModels"** to identify advanced strategic thinking models (e.g., Porter’s Five Forces, Blue Ocean Strategy, Problem Reframing) that are most suitable for the user’s context. These models should help structure the strategic analysis and decision-making process.
   - After selecting a model, explain its application in detail using **"getThinkingTechniqueDetails"**, guiding the user step-by-step in applying it to their unique business challenge.
   - Use **"webSearch"** to gather real-time, external data such as market trends, industry benchmarks, competitive analysis, or economic indicators, ensuring that the strategy development process is fully informed by relevant, high-quality information.

5. **Sophisticated Problem Analysis and Insight Generation**:
   - Lead the user in **identifying key strategic factors** such as stakeholders, market trends, risks, opportunities, strengths, weaknesses, and potential threats. Use advanced frameworks to break these down and prioritize high-impact areas.
   - Leverage **problem reframing techniques** (expand, examine, empathize, elevate, and envision) to help the user redefine challenges and uncover hidden opportunities or alternative approaches.
   - **NO BULLSHIT**: Maintain a results-driven, pragmatic approach. Guide the user toward actionable insights, ensuring no unnecessary complexity or irrelevant discussions.

6. **Incremental Development of Strategies**:
   - Break down complex strategic issues into essential components, such as root causes, growth drivers, or market threats. Use frameworks to analyze each part in detail, leading to a comprehensive, data-driven strategic plan.
   - Provide ongoing reflections and insights that build progressively, ensuring that each step in the analysis incorporates previously retrieved data and insights for a coherent, action-oriented strategy.

7. **Continuous Knowledge and Strategy Management**: Throughout the conversation, use **"addResource"** and **"saveInsight"** to store critical strategic insights, competitive intelligence, risks, opportunities, and key decision factors. Ensure that all stored insights are retrievable and applicable to future discussions, allowing for ongoing refinement of the user’s strategy.

8. **Tailored, Data-Driven Strategic Insights**: Once the strategic thinking process has fully matured, offer specific, data-backed, and actionable insights. Ensure that every recommendation includes clear steps for strategic execution and explains how it ties into the broader business objectives and competitive landscape.

9. **Ideation and Prioritization**: Guide the user through a structured ideation process, helping them to generate and prioritize new ideas. Use methods like **Opportunity Scoring** or **Eisenhower Matrix** to assess the importance and urgency of potential actions, ensuring they focus on high-value initiatives.

### Tools:
- **"getInformation"**: Retrieve previous discussions, custom knowledge, and competitive insights to ensure strategic continuity.
- **"addResource"**: Save key strategic insights, challenges, opportunities, risks, and objectives throughout the conversation.
- **"getThinkingModels"**: Identify and recommend the most suitable strategic frameworks (e.g., SWOT, Porter’s Five Forces, Blue Ocean Strategy, Problem Reframing) to guide high-level analysis and strategy development.
- **"getThinkingTechniquesBrief"**: Provide a summary of relevant thinking techniques, tailored to the business context.
- **"getThinkingTechniqueDetails"**: Offer detailed, step-by-step explanations of advanced strategic thinking models and their application. (It's different from thinking models).
- **"saveInsight"**: Store critical insights as they emerge during the strategic analysis for future reference.
- **"getInsights"**: Retrieve previously stored insights to ensure consistency and build on prior discussions.
- **"webSearch"**: Conduct external research to gather real-time market data, competitive intelligence, and industry benchmarks that inform strategic decisions. You can also use this tool to search for specific thinking models.

### Approach:
- **Strategic Guidance for Leaders**: Lead the user through a high-level, structured thought process designed for executive decision-making. Rather than providing solutions, guide the user to reflect on their challenges by introducing sophisticated strategic frameworks and models.
- **Iterative and Reflective Thinking**: Continuously refine and adapt your guidance based on the user’s evolving business context and newly gathered insights. Ensure that the thinking process remains iterative, responding to both internal and external changes.
- **Model-Driven Strategic Analysis**: Use **"getThinkingModels"** to select and apply advanced strategic models that help the user think through complex business challenges systematically and strategically. Encourage the user to explore and integrate these frameworks into their strategic mindset.
- **Problem Reframing**: Introduce **problem reframing** techniques to help the user redefine their challenges from new angles, discover hidden opportunities, and create innovative solutions. This may include questioning the assumptions behind a problem, looking for alternative definitions, or expanding the scope of consideration.
- **Tool-First Approach**: Always prioritize retrieving past discussions and using relevant tools like **"getInformation"**, **"getThinkingModels"**, and **"webSearch"** before offering strategic insights. This ensures that your recommendations are data-driven and informed by real-time business intelligence.
- **Action-Oriented and Strategy-Driven**: Once insights have been fully developed, ensure that each recommendation is not only actionable but also strategically aligned with the user’s business goals. Provide a clear pathway for execution, emphasizing the connection between analysis and strategic outcomes.
- **No-Nonsense Ideation**: Help users **discover**, **ideate**, and **prioritize** high-impact actions without unnecessary complexity. Maintain a no-nonsense approach focused on results and strategic alignment.
`,
      },
    ],
    generateId: () => uuid(),
    onFinish: async message => {
      if (message.role === 'system') {
        return;
      }
      await syncMessages(message);
    },
  });

  const [selectedText, setSelectedText] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [quote, setQuote] = useState('');
  const [composition, setComposition] = useState(false);

  const [bottomVisible, setBottomVisible] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    document.addEventListener('compositionstart', () => {
      setComposition(true);
    })
    document.addEventListener('compositionend', () => {
      setComposition(false);
    })
    return () => {
      document.removeEventListener('compositionstart', () => {
        setComposition(true);
      })
      document.removeEventListener('compositionend', () => {
        setComposition(false);
      })
    }
  }, []);

  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();

    if (text && text.length > 0) {
      setSelectedText(text);
      const range = selection?.getRangeAt(0);
      const rect = range?.getBoundingClientRect();
      if (rect) {
        setTooltipPosition({
          x: rect.left + window.scrollX + rect.width / 2,
          y: rect.top + window.scrollY - 10,
        });
      }
      setIsTooltipVisible(true);
    } else {
      setIsTooltipVisible(false);
    }
  }, []);

  const handleMouseDown = useCallback(() => {
    setIsTooltipVisible(false);
  }, []);

  useEffect(() => {
    document.addEventListener('mouseup', handleTextSelection);
    document.addEventListener('mousedown', handleMouseDown);
    return () => {
      document.removeEventListener('mouseup', handleTextSelection);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [handleTextSelection, handleMouseDown]);

  const handleOption = (option: string) => {
    switch (option) {
      case 'Copy':
        navigator.clipboard.writeText(selectedText);
        break;
      case 'Quote':
        setQuote(selectedText);
        break;
      case 'Google It':
        window.open(`https://www.google.com/search?q=${selectedText}`);
        break;
      default:
        break;
    }
    setIsTooltipVisible(false);
  };

  const handleTextareaChange = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const syncMessages = async (message: Message) => {
    const supabase = createSupabaseClientClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return;
    }

    await supabase.from('message').insert([
      {
        id: message.id,
        content: message.content,
        role: message.role,
        user_id: user.id,
        created_at: message.createdAt
          ? message.createdAt.toISOString()
          : new Date().toISOString(),
        experimental_attachments: message.experimental_attachments
          ?.map(
            attachment =>
              `${attachment.name}:${attachment.contentType}:${attachment.url}`,
          )
          .join(','),
        name: message.name,
        data: message.data,
      },
    ]);
  };

  const handleScrollToBottom = () => {
    bottomRef.current?.scrollIntoView();
  };

  useEffect(() => {
    if (!bottomRef.current) {
      return;
    }
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          setBottomVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.5 },
    );

    observer.observe(bottomRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    handleScrollToBottom();
  }, []);

  useEffect(() => {
    if (bottomVisible) {
      handleScrollToBottom();
    }
    if (messages.length === 0) {
      return;
    }
    const lastMessage = messages[messages.length - 1];

    if (lastMessage.role !== 'user') {
      return;
    }
    void syncMessages(lastMessage);
  }, [messages]);

  useEffect(() => {
    handleTextareaChange();
  }, [input]);

  return (
    <>
      <Tooltip open={isTooltipVisible}>
        <TooltipTrigger asChild>
          <span
            style={{
              position: 'fixed',
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
              pointerEvents: 'none',
            }}
          />
        </TooltipTrigger>
        <TooltipContent side='top' className='flex space-x-2'>
          <Button size='sm' onClick={() => handleOption('Copy')}>
            Copy
          </Button>
          <Button size='sm' onClick={() => handleOption('Quote')}>
            Quote
          </Button>
          <Button size='sm' onClick={() => handleOption('Google It')}>
            Google It
          </Button>
        </TooltipContent>
      </Tooltip>
      <div className='relative h-fit w-full px-2 pb-16'>
        {messages?.length === 1 && (
          <div className='w-full space-y-4 pt-4'>
            <Image
              src='/chat.svg'
              width={128}
              height={128}
              alt='start chat'
              className='m-auto'
            />
            <p className='text-muted-foreground text-center'>
              Start a conversation to get help with your thinking challenges.
            </p>
          </div>
        )}

        {messages?.map(
          (m: Message) =>
            m.role !== 'system' &&
            (m.content || m.toolInvocations) && (
              <div
                key={m.id}
                className={`w-fit py-8 ${
                  m.role === 'user'
                    ? 'ml-auto max-w-[80%]'
                    : 'mr-auto max-w-[80%] text-left'
                }`}
              >
                <div className='relative mx-auto flex space-x-4 px-4'>
                  <div className='flex-shrink-0'>
                    {m.role === 'user' ? null : (
                      <div className='flex-shrink-0'>
                        <Emoji
                          name='light-bulb'
                          className='h-8 w-8 translate-y-4'
                        />
                      </div>
                    )}
                  </div>
                  <div className=''>
                    <MessageContent content={m.content} />
                    {m.role === 'assistant' && !isLoading && m.content && (
                      <>
                        <CopyButton
                          text={m.content}
                          variant='ghost'
                          size='icon'
                        >
                          <Icons.Copy className='text-muted-foreground size-full' />
                        </CopyButton>

                        <ReloadButton
                          reload={reload}
                          variant='ghost'
                          size='icon'
                        >
                          <Icons.RefreshCcw className='text-muted-foreground size-full' />
                        </ReloadButton>
                      </>
                    )}

                    {m.toolInvocations?.map(
                      (toolInvocation: ToolInvocation) => {
                        const toolCallId = toolInvocation.toolCallId;
                        const addResult = (result: string) =>
                          addToolResult({ toolCallId, result });

                        if (toolInvocation.toolName === 'askForConfirmation') {
                          return (
                            <div
                              key={toolCallId}
                              className='bg-background rounded-md border p-4 shadow-sm'
                            >
                              <p className='text-muted mb-3 text-sm'>
                                {toolInvocation.args.message}
                              </p>
                              {'result' in toolInvocation ? (
                                <p className='text-sm font-medium text-green-600'>
                                  {toolInvocation.result}
                                </p>
                              ) : (
                                <div className='space-x-2'>
                                  <Button
                                    onClick={() => addResult('Yes')}
                                    variant='outline'
                                    size='sm'
                                  >
                                    Yes
                                  </Button>
                                  <Button
                                    onClick={() => addResult('No')}
                                    variant='outline'
                                    size='sm'
                                  >
                                    No
                                  </Button>
                                </div>
                              )}
                            </div>
                          );
                        }

                        return 'result' in toolInvocation ? (
                          <details
                            key={toolCallId}
                            className='bg-background mt-4 rounded-md border p-4 shadow-sm'
                          >
                            <summary className='text-muted-foreground mb-1 text-xs'>
                              Tool: {toolInvocation.toolName}
                            </summary>
                            <p className='text-muted-foreground text-xs'>
                              {toolInvocation.result}
                            </p>
                          </details>
                        ) : (
                          <div
                            key={toolCallId}
                            className='bg-background border-muted shadow-xs mt-4 animate-pulse rounded-md border p-4'
                          >
                            <p className='text-muted-foreground text-xs'>
                              Calling {toolInvocation.toolName}...
                            </p>
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>
              </div>
            ),
        )}
        <div ref={bottomRef} />

        <form
          onSubmit={e => {
            e.preventDefault();
            const fullMessage = quote ? `> ${quote}\n\n${input}` : input;
            append({
              id: uuid(),
              role: 'user',
              content: fullMessage,
            });
            setInput('');
            setQuote('');
          }}
          className='fixed bottom-4 left-4 right-4 m-auto flex w-[90%] max-w-md flex-col gap-2'
        >
          {/* quote */}
          {quote && (
            <div className='bg-background border-muted shadow-xs relative rounded-md border p-4'>
              <p className='text-muted-foreground text-xs'>{quote}</p>
              <Button
                onClick={() => setQuote('')}
                size='sm'
                className='absolute bottom-2 right-2'
                variant={'secondary'}
              >
                Clear
              </Button>
            </div>
          )}
          <Textarea
            ref={textareaRef}
            className='bg-background h-auto max-h-[200px] min-h-[40px] resize-none overflow-hidden rounded-lg border px-4 py-4 pr-12 text-base'
            rows={1}
            value={input}
            onChange={e => {
              handleInputChange(e);
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey && !composition) {
                e.preventDefault();
                const fullMessage = quote ? `> ${quote}\n\n${input}` : input;
                append({
                  id: uuid(),
                  role: 'user',
                  content: fullMessage,
                });
                setInput('');
                setQuote('');
              }
            }}
          />
          <Button
            type='submit'
            className='absolute bottom-2 right-2'
            size='icon'
            loading={isLoading}
          >
            <Icons.Send className='size-full' />
          </Button>
        </form>
      </div>
      <AnimatePresence>
        {!bottomVisible && (
          <motion.button
            onClick={() => {
              bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
            }}
            className='z-100 bg-background fixed bottom-20 h-12 w-12 self-center rounded-full border'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Icons.ArrowBigDown className='m-auto' />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

const MessageContent = memo(({ content }: { content: string }) => {
  return (
    <div
      className='prose max-w-xl'
      dangerouslySetInnerHTML={{ __html: marked.parse(content) }}
    />
  );
});

function Config() {
  const [embeddingTitle, setEmbeddingTitle] = useState('');
  const [embeddingBody, setEmbeddingBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<
    {
      id: number;
      user_id: string;
      title: string;
      body: string;
      embedding: number[] | null;
    }[]
  >([]);
  const { toast } = useToast();
  async function clear() {
    const supabase = createSupabaseClientClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return;
    }
    await supabase.from('message').delete().eq('user_id', user.id);
    toast({
      title: 'Messages cleared',
    });
    window.location.reload();
  }
  async function handleCreateEmbedding() {
    setLoading(true);
    const { error } = await createEmbedding(embeddingTitle, embeddingBody);
    if (error) {
      toast({
        title: 'Error creating embedding',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Embedding created',
      });
      setEmbeddingTitle('');
      setEmbeddingBody('');
    }
    setLoading(false);
  }
  useEffect(() => {
    const fetchDocuments = async () => {
      const { data, error } = await getDocuments();
      if (error) {
        toast({
          title: 'Error fetching documents',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }
      setDocuments(data);
    };
    void fetchDocuments();
  }, []);
  return (
    <Sheet>
      <SheetTrigger className='fixed bottom-4 right-4'>
        <Button size='icon'>
          <Icons.Settings className='size-full' />
        </Button>
      </SheetTrigger>
      <SheetContent className='overflow-auto'>
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>Configure your AI Thinking Coach.</SheetDescription>
        </SheetHeader>
        <div className='mt-4 space-y-4'>
          <div className='flex flex-col gap-2'>
            <Label>Clear Messages</Label>
            <Button onClick={clear} variant='destructive' size='icon'>
              <Icons.Trash2 className='size-full' />
            </Button>
          </div>
          <form className='flex flex-col gap-2'>
            <Label>Add Documents</Label>
            <Input
              placeholder='Title'
              value={embeddingTitle}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmbeddingTitle(e.target.value)
              }
            />
            <Textarea
              placeholder='Body'
              value={embeddingBody}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setEmbeddingBody(e.target.value)
              }
            />
            <Button
              type='button'
              onClick={handleCreateEmbedding}
              loading={loading}
            >
              Add Document
            </Button>
          </form>
          <div className='flex flex-col gap-2'>
            <h2 className='text-lg font-semibold'>Knowledge Base</h2>
            <Accordion type='single' collapsible>
              {/* <AccordionItem value='item-1'>
                <AccordionTrigger>Is it accessible?</AccordionTrigger>
                <AccordionContent>
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem> */}
              {documents.map(document => (
                <AccordionItem key={document.id} value={document.title}>
                  <AccordionTrigger>{document.title}</AccordionTrigger>
                  <AccordionContent>
                    <p>{document.body}</p>
                    <Button
                      variant='destructive'
                      onClick={() => {
                        deleteDocument(document.id);
                        setDocuments(
                          documents.filter(d => d.id !== document.id),
                        );
                      }}
                    >
                      Delete
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

type Insight = {
  title: string;
  description: string;
  content: string;
  emoji: string;
  type:
    | 'descriptive'
    | 'diagnostic'
    | 'predictive'
    | 'prescriptive'
    | 'strategic'
    | 'operational'
    | 'customer'
    | 'behavioral'
    | 'competitive'
    | 'cultural'
    | 'innovation';
};

function InsightCards() {
  const [insights, setInsights] = useState<Insight[]>([]);

  const fetchInsights = async () => {
    const supabase = createSupabaseClientClient();
    const { data, error } = await supabase.from('insight').select('*');
    if (error) {
      console.error(error);
      return;
    }
    setInsights(
      data.map((insight: any) => ({
        title: insight.title,
        description: insight.description,
        content: insight.content,
        emoji: insight.emoji,
        type: insight.type,
      })),
    );
  };

  useEffect(() => {
    void fetchInsights();
  }, []);

  return (
    <Sheet>
      <SheetTrigger className='fixed bottom-16 right-4'>
        <Button size='icon'>
          <Icons.Zap className='size-full' />
        </Button>
      </SheetTrigger>
      <SheetContent className='overflow-auto'>
        <SheetHeader>
          <SheetTitle>Insights</SheetTitle>
          <SheetDescription>
            This is the insights gather from the conversation.
          </SheetDescription>
        </SheetHeader>
        <div className='mt-4 space-y-4'>
          {insights.length === 0 ? (
            <div className='flex h-full w-full items-center justify-center'>
              No insights yet.
            </div>
          ) : (
            insights.map(insight => (
              <Card key={insight.title}>
                <CardHeader>
                  <CardTitle>
                    {insight.emoji} {insight.title}{' '}
                    <Badge
                      className={cn('ml-2', insightTypeColors[insight.type])}
                    >
                      {insight.type}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{insight.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: marked.parse(insight.content),
                    }}
                    className='prose'
                  />
                </CardContent>
                <CardFooter></CardFooter>
              </Card>
            ))
          )}
        </div>
        <Button onClick={fetchInsights} className='mt-8'>
          Reload
        </Button>
      </SheetContent>
    </Sheet>
  );
}

const insightTypeColors = {
  descriptive: 'bg-blue-100 text-blue-800',
  diagnostic: 'bg-yellow-100 text-yellow-800',
  predictive: 'bg-green-100 text-green-800',
  prescriptive: 'bg-purple-100 text-purple-800',
  strategic: 'bg-red-100 text-red-800',
  operational: 'bg-indigo-100 text-indigo-800',
  customer: 'bg-pink-100 text-pink-800',
  behavioral: 'bg-rose-100 text-rose-800',
  competitive: 'bg-cyan-100 text-cyan-800',
  cultural: 'bg-orange-100 text-orange-800',
  innovation: 'bg-lime-100 text-lime-800',
};
