export class AnalysisResult {
    
    id: number;
    analysis__id: number;
    analysis__analysis_method__method: string;
    parameter__parameter: string;
    value: string;
    value_txt: string;
    unit__unit: string;
    analysis__sample__sample_number: number;
    analysis__sample__drillcore__name: string;
    value_error: string;
    lower_limit: string;
}