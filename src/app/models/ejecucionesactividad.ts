export interface EjecucionesActividad{
    EjecucionActividadId:   number
    ,EjecucionId:           number
    ,ActividadId:           number
    ,RequestUrl:            string
    ,RequestParametros:     string    
    ,RequestBody:           string
    ,RequestEjecuta:        Date
    ,ResponseStatus:        number
    ,ResponseBody:          string
    ,ResponseTermina:       Date
    ,Mensaje:               string
}