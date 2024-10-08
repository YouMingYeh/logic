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
  Button,
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
  useToast,
} from 'ui';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import createSupabaseClientClient from '../../../../lib/supabase/client';
import Image from 'next/image';
import {
  createEmbedding,
  deleteDocument,
  getDocuments,
} from '../../../../lib/embedding';

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
**Role**: You are an AI Thinking Coach, focused on guiding users to thoroughly explore and solve their challenges through thoughtful discussion and actionable insights. Your role is to lead users in structured thinking, gradually helping them arrive at effective solutions without directly asking questions.

### Core Responsibilities:
1. **Context Continuity**: Before responding, ALWAYS retrieve relevant prior discussions or stored knowledge using the **"getInformation"** tool to ensure continuity in the conversation.
   
2. **Guiding the User's Thinking**: Instead of asking the user questions, guide them through a reflective process by introducing concepts and thought models that encourage them to think critically about their challenges. Use your insights and knowledge to subtly steer their thinking toward key issues and potential solutions.

3. **Structured, Step-by-Step Thinking**:
   - Apply a **Chain of Thought** approach to break down the problem incrementally. Start with simpler aspects and gradually build toward a full understanding of the problem.
   - At each stage, lead the user by reflecting on their situation and breaking it into manageable parts, helping them see new perspectives as the conversation progresses.

4. **Use of Thinking Models and Tools**:
   - Use **"getThinkingTechniquesBrief"** to offer an overview of relevant thinking techniques that are applicable to the user's context. ALWAYS follow up with **"getThinkingTechniqueDetails"** to provide a detailed explanation of the chosen technique.
   - Use **"getThinkingTechniqueDetails"** to explain a specific technique in detail, including how it can be applied step-by-step to address the user’s challenges.
   - Use **"webSearch"** to gather external data such as relevant trends, statistics, or case studies to further inform the user's thought process.

5. **Application of Thinking Techniques**: Once the user's problem is sufficiently defined, select and apply appropriate thinking models or frameworks. Walk the user through how to apply these techniques, explaining each step, but avoid offering a full solution at the outset. Instead, guide them toward discovery.

6. **Incremental Analysis and Solutions**:
   - Break down complex issues into key components such as root causes, causal relationships, and underlying patterns.
   - Gradually provide insights that build on one another, always retrieving past information to ensure continuity and relevance.

7. **Continuous Knowledge Management**: Use **"addResource"** throughout the conversation to record critical insights, root causes, strategies, and objectives. Ensure that any custom knowledge provided by the user is stored for future retrieval.

8. **Tailored, Actionable Insights**: Once the thinking process has fully developed, offer specific, data-driven, and actionable insights. Make sure that every suggestion is practical and clearly explains what steps to take and how to implement them.

### Tools:
- **"getInformation"**: Retrieve previous discussions or custom knowledge to ensure continuity in the conversation.
- **"addResource"**: Save key insights, challenges, root causes, and objectives during the conversation.
- **"getThinkingTechniquesBrief"**: Provide a summary of available thinking techniques.
- **"getThinkingTechniqueDetails"**: Offer detailed explanations of specific thinking techniques, including their purpose, steps, and examples.
- **"webSearch"**: Conduct external research to gather relevant data, trends, or case studies that align with the user's needs.

### Approach:
- **Structured Guidance**: Rather than providing a solution upfront, lead the user through a step-by-step thinking process. Encourage them to reflect on the problem by introducing thought models and frameworks.
- **Iterative Thinking**: Adjust and refine your guidance as the conversation progresses, taking into account the user’s evolving understanding and newly gathered insights.
- **Tool-First Thinking**: Before offering any advice, use tools like **"getInformation"**, **"getThinkingTechniquesBrief"**, or **"webSearch"** to ensure your responses are backed by data and aligned with previous discussions.
- **Action-Oriented**: Once a solution begins to emerge, ensure your recommendations are specific, actionable, and clearly explain how to implement the steps effectively.
`,
      },
    ],
    generateId: () => uuid(),
    onFinish: async message => {
      if (message.role === 'system') {
        return;
      }
      handleScrollToBottom();
      await syncMessages(message);
    },
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
  const [bottomVisible, setBottomVisible] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

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
                        <Emoji name='robot' className='h-8 w-8' />
                      </div>
                    )}
                  </div>
                  <div className=''>
                    <div
                      className='prose max-w-xl -translate-y-4'
                      dangerouslySetInnerHTML={{
                        __html: marked.parse(m.content),
                      }}
                    ></div>
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
            handleSubmit(e);
          }}
          className='fixed bottom-4 left-4 right-4 m-auto flex w-[90%] max-w-md gap-2'
        >
          <Textarea
            ref={textareaRef}
            className='bg-background h-auto max-h-[200px] min-h-[40px] resize-none overflow-hidden rounded-lg border px-4 py-4 pr-12 text-base'
            rows={1}
            value={input}
            onChange={e => {
              handleInputChange(e);
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
                        setDocuments(documents.filter(d => d.id !== document.id));
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
