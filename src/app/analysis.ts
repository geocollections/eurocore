export class Analysis {
   
        id: number;
        sample__id: number;
        sample__number: string;
        sample__drillcore__id: number;
        sample__drillcore__name: string;
        analysis_method__method: string;
        lab__lab: string;
        instrument__instrument: string;
        depth: number;
        start_depth: number;
        end_depth: number;
        date: string;
        agent__name: string;
      }