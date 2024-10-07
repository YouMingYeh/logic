import{a as u,j as o}from"./jsx-runtime-DxxSdIgP.js";import{T as I,a as O,b as y,c as M,d as x,e as V,B as w}from"./index-CcksvfCo.js";import{r as m}from"./index-BBkUAzwr.js";import"./extends-CCbyfPlC.js";import"./index-PqR-_bA4.js";import"./index-YMbfICiA.js";const C=1,R=1e6;let l=0;function B(){return l=(l+1)%Number.MAX_SAFE_INTEGER,l.toString()}const p=new Map,S=t=>{if(p.has(t))return;const s=setTimeout(()=>{p.delete(t),c({type:"REMOVE_TOAST",toastId:t})},R);p.set(t,s)},j=(t,s)=>{switch(s.type){case"ADD_TOAST":return{...t,toasts:[s.toast,...t.toasts].slice(0,C)};case"UPDATE_TOAST":return{...t,toasts:t.toasts.map(e=>e.id===s.toast.id?{...e,...s.toast}:e)};case"DISMISS_TOAST":{const{toastId:e}=s;return e?S(e):t.toasts.forEach(a=>{S(a.id)}),{...t,toasts:t.toasts.map(a=>a.id===e||e===void 0?{...a,open:!1}:a)}}case"REMOVE_TOAST":return s.toastId===void 0?{...t,toasts:[]}:{...t,toasts:t.toasts.filter(e=>e.id!==s.toastId)}}},d=[];let T={toasts:[]};function c(t){T=j(T,t),d.forEach(s=>{s(T)})}function N({...t}){const s=B(),e=r=>{c({type:"UPDATE_TOAST",toast:{...r,id:s}})},a=()=>{c({type:"DISMISS_TOAST",toastId:s})};return c({type:"ADD_TOAST",toast:{...t,id:s,open:!0,onOpenChange:r=>{r||a()}}}),{id:s,dismiss:a,update:e}}function _(){const[t,s]=m.useState(T);return m.useEffect(()=>(d.push(s),()=>{const e=d.indexOf(s);e>-1&&d.splice(e,1)}),[t]),{...t,toast:N,dismiss:e=>{c({type:"DISMISS_TOAST",toastId:e})}}}function P(){const{toasts:t}=_();return u(I,{children:[t.map(({id:s,title:e,description:a,action:r,...D})=>u(O,{...D,children:[u("div",{className:"grid gap-1",children:[e&&o(y,{children:e}),a&&o(M,{children:a})]}),r,o(x,{})]},s)),o(V,{})]})}const Q={title:"Components/Toast",component:O,parameters:{layout:"padded"},argTypes:{title:{control:"text",defaultValue:"This is a toast message"},variant:{control:"select",options:["default","destructive"],defaultValue:"default"}}},n=({title:t,variant:s})=>{const{toast:e}=_();return u("div",{children:[o(w,{onClick:()=>e({title:t,variant:s}),variant:"outline",children:"Show toast"}),o(P,{})]})},i={name:"SingleToast",args:{title:"This is a toast message",variant:"default"},render:t=>o(n,{...t})};i.args={title:"This is a toast message",variant:"default"};var f,g,h;n.parameters={...n.parameters,docs:{...(f=n.parameters)==null?void 0:f.docs,source:{originalSource:`({
  title,
  variant
}) => {
  const {
    toast
  } = useToast();
  return <div>
      <Button onClick={() => toast({
      title,
      variant
    })} variant='outline'>
        Show toast
      </Button>
      <Toaster />
    </div>;
}`,...(h=(g=n.parameters)==null?void 0:g.docs)==null?void 0:h.source}}};var A,v,E;i.parameters={...i.parameters,docs:{...(A=i.parameters)==null?void 0:A.docs,source:{originalSource:`{
  name: 'SingleToast',
  args: {
    title: 'This is a toast message',
    variant: 'default'
  },
  render: args => <DefaultToast {...args} />
}`,...(E=(v=i.parameters)==null?void 0:v.docs)==null?void 0:E.source}}};const X=["DefaultToast","SingleToast"];export{n as DefaultToast,i as SingleToast,X as __namedExportsOrder,Q as default};
