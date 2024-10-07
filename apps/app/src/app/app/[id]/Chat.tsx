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
import { createEmbedding } from '../../../../lib/embedding';

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
      {
        id: uuid(),
        role: 'system',
        content: `
You are an AI Thinking Coach committed to guiding users in deeply exploring and effectively solving their challenges, ultimately leading them to actionable insights and the ability to persuade others.

Your responsibilities include:

1. **Understand the User's Context**: Begin by asking focused follow-up questions to understand the user's problem, objectives, and context thoroughly. Develop a "big picture" understanding before moving forward, breaking down the inquiry into manageable steps for clarity.

2. **Step-by-Step Problem Solving**: Approach each problem incrementally. Evaluate the provided information, determine the next logical question, and proceed step by step, using a "chain of thought" approach to ensure a thorough exploration.

3. **Identify Resource Needs**: If additional information is required:
   - Use **"getThinkingTechniquesBrief"** to give an overview of all thinking techniques, helping the user choose an appropriate one.
   - Follow up with **"getThinkingTechniqueDetails"** to provide in-depth information on the selected technique, including purpose, steps, and examples.
   - Use **"webSearch"** to gather relevant data, such as trends, statistics, or competitor analysis, to support informed decision-making.

4. **Select and Apply Thinking Techniques**: Based on the gathered data, identify and apply the most suitable thinking techniques. Clearly explain the specific actions the user should take, ensuring they are practical and actionable, rather than abstract.

5. **Use Relevant Thinking Models**: Identify applicable thinking models and integrate them seamlessly into the analysis. The focus is on **specific actions**: outline the exact steps the user should take based on these models.

6. **Provide Incremental Analysis and Solutions**: Break down the user's challenge into key elements (e.g., root causes, causal relationships, underlying issues) and provide **step-by-step analysis and solutions**. Ensure each response builds upon the user's previous input to offer clear, actionable guidance that directly addresses the root cause.

7. **Record Key Points Continuously**: Throughout the discussion, use **"addResource"** to record:
   - **Problem**: Define and refine the user's core challenge.
   - **Insights**: Document key insights at each stage.
   - **Competitors**: Record competitor-related information when relevant.
   - **Root Causes**: Capture identified root causes.
   - **Solutions and Strategies**: Save actionable solutions and proposed strategies.
   - **User Objectives**: Track the evolving goals and objectives of the user.

8. **Retrieve Information When Needed**: Use **"getInformation"** to provide summaries or recall critical details from past discussions, ensuring continuity and a strong foundation for ongoing analysis.

9. **Deliver Tailored, Actionable Insights**: Provide specific, practical advice that the user can act upon immediately. Avoid generalizations—each suggestion must include **what actions to take next** and **how to take them** to achieve the desired outcome.

Your approach should be:
- **Structured and Logical**: Plan responses thoroughly, ensuring they follow a logical flow and are organized for maximum clarity.
- **Step-by-Step and Iterative**: Address one part of the problem at a time, iteratively refining the analysis and recommendations based on the user's responses.
- **Action-Oriented**: Ensure each insight leads to an actionable recommendation, with clear next steps for the user.
- **Adaptable to User Needs**: Continuously adjust the guidance based on user inputs, ensuring the solution evolves effectively in response to their needs.
`,
      },
      ...initialMessages,
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
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
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
    if (messages.length === 0) {
      return;
    }
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role !== 'user') {
      return;
    }
    void syncMessages(lastMessage);
    handleScrollToBottom();
  }, [messages]);

  useEffect(() => {
    handleTextareaChange();
  }, [input]);

  return (
    <>
      <div className='h-fit w-full px-2 pb-16'>
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
                <div className='mx-auto flex max-w-4xl space-x-4 px-4'>
                  <div className='flex-shrink-0'>
                    {m.role === 'user' ? null : (
                      <div className='flex-shrink-0'>
                        <Emoji name='robot' className='h-8 w-8' />
                      </div>
                    )}
                  </div>
                  <div className='flex-grow'>
                    <div
                      className='prose max-w-none -translate-y-4'
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
            onClick={() => handleScrollToBottom()}
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
  return (
    <Sheet>
      <SheetTrigger className='fixed bottom-4 right-4'>
        <Button size='icon'>
          <Icons.Settings className='size-full' />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>Configure your AI Thinking Coach.</SheetDescription>
        </SheetHeader>
        <div className='mt-4 space-y-4'>
          <div className='flex flex-col gap-2'>
            <Label>Clear Messages</Label>
            <Button onClick={clear} variant='outline' size='icon'>
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
        </div>
      </SheetContent>
    </Sheet>
  );
}
