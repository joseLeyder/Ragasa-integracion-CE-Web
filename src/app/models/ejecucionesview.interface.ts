export interface EjecucionesView{
    EjecucionId:          number,
    OrigenId:             number,
    EntidadId:            number,
    TipoResultadoId:      number,
    FechaEjecucion:       Date,
    Entidad:              string,
    Resultado:            string,
    ResultadoIcon:        string,
    Origen:               string,
    OrigenIcon:           string,
    Destino:              string,
    DestinoIcon:          string,
    FechaEjecucionFormat: string
  }