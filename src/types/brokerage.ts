export type Brokerage = {
  id: string;
  name: 'Questrade';
  url: 'https://questrade.com';
  enabled: boolean;
  authorization_types: [
    {
      type: 'read' | 'trade';
    },
  ];
};