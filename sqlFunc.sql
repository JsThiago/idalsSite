--FINAL
CREATE OR REPLACE FUNCTION public.buscar_pontos(min_dist integer, funcionario text, _data text, de text, ate text, id_localizacao integer, simplify_param integer, OUT ids integer[], OUT funcionario_out character varying, OUT arr_geom geometry[], OUT dates timestamp without time zone[])
 RETURNS record
 LANGUAGE plpgsql
AS $function$
declare 
i "data";
aux_geom geometry;
line geometry;

begin
    funcionario_out:= funcionario;
    SELECT ST_MakeLine(d.localizacao ORDER BY d.date)
    INTO line
    FROM
        "data" d
    WHERE
        ST_Within(
            d.localizacao,
            ST_SETSRID((SELECT l.localizacao FROM localidade l WHERE l.id = id_localizacao), 4674)
        )
        AND d.nome_funcionario = funcionario
        AND d."date" BETWEEN CONCAT(_data, ' ', de)::timestamp AND CONCAT(_data, ' ', ate)::timestamp;
    
    IF simplify_param IS NOT NULL THEN
        line := ST_Simplify(line, simplify_param);
    END IF;
    
    for i in select * from "data" d where ST_Within(d.localizacao,ST_SETSRID((select l.localizacao from localidade l where l.id = id_localizacao),4674)) 
       and d.nome_funcionario = funcionario 
       and d."date" between concat(_data,' ',de)::timestamp and concat(_data,' ',ate)::timestamp
       and ST_Intersects(d.localizacao,line)
       loop
	
	    if aux_geom is null and not ST_Equals(i.localizacao,ST_SetSRID(ST_GeomFromText('POINT (0 0)'),4674)) then
	       aux_geom:= i.localizacao;
	       arr_geom:= array_append(arr_geom,i.localizacao);
	       ids:= array_append(ids,i.id);
	       dates:= array_append(dates,i.date);
	    end if;
	    if ST_Distance(ST_TRANSFORM(aux_geom, 31983),ST_TRANSFORM(i.localizacao, 31983)) >= min_dist and not ST_Equals(i.localizacao,ST_SetSRID(ST_GeomFromText('POINT (0 0)'),4674))   then
	         arr_geom:= array_append(arr_geom,i.localizacao);
	         aux_geom:= i.localizacao;
	         ids:= array_append(ids,i.id);
	         dates:= array_append(dates,i.date);
	    end if;
    	
    end loop;
end;
$function$
;

--
CREATE OR REPLACE FUNCTION public.teste(min_dist integer, funcionario text, _data text, de text, ate text, gap integer)
 RETURNS geometry[]
 LANGUAGE plpgsql
AS $function$
declare 
query_all "data"[];
i int :=0;
size_all int;
_result geometry[];
_arr_geom text[];
arr_aux geometry[];
  
begin
	_arr_geom:= ARRAY(select unnest(arr_geom) as geom from buscar_pontos(min_dist,funcionario,_data,de,ate));
    select ceil(array_length(_arr_geom,1)::float/gap) into size_all;
    while i < size_all loop
	  
	     arr_aux := _arr_geom[(i*gap)+1:(i+1)*gap + 1 ];
	     if(array_length(arr_aux,1)>1) then
	     	_result := array_append(_result, ST_Simplify(ST_MakeLine(_arr_geom[(i*gap)+1:(i+1)*gap + 1 ]), 10));
	     end if;
	    i :=i+1;
    	
    end loop;
	return _result;
end;
$function$
;



CREATE OR REPLACE FUNCTION public.buscar_pontos(min_dist integer, funcionario text, _data text, de text, ate text, id_localizacao integer, OUT ids integer[], OUT funcionario_out character varying, OUT arr_geom geometry[], OUT dates timestamp without time zone[])
 RETURNS record
 LANGUAGE plpgsql
AS $function$
declare 
i "data";
aux_geom geometry;
line geometry;

begin
    funcionario_out:= funcionario;
    SELECT ST_MakeLine(d.localizacao ORDER BY d.date)
    INTO line
    FROM
        "data" d
    WHERE
        ST_Within(
            d.localizacao,
            ST_SETSRID((SELECT l.localizacao FROM localidade l WHERE l.id = id_localizacao), 4674)
        )
        AND d.nome_funcionario = funcionario
        AND d."date" BETWEEN CONCAT(_data, ' ', de)::timestamp AND CONCAT(_data, ' ', ate)::timestamp;
    
    for i in select * from "data" d where ST_Within(d.localizacao,ST_SETSRID((select l.localizacao from localidade l where l.id = id_localizacao),4674)) and d.nome_funcionario = funcionario and d."date" between concat(_data,' ',de)::timestamp and concat(_data,' ',ate)::timestamp loop
	
	    if aux_geom is null and not ST_Equals(i.localizacao,ST_SetSRID(ST_GeomFromText('POINT (0 0)'),4674)) then
	       aux_geom:= i.localizacao;
	       arr_geom:= array_append(arr_geom,i.localizacao);
	       ids:= array_append(ids,i.id);
	       dates:= array_append(dates,i.date);
	    end if;
	    if ST_Distance(ST_TRANSFORM(aux_geom, 31983),ST_TRANSFORM(i.localizacao, 31983)) >= min_dist and not ST_Equals(i.localizacao,ST_SetSRID(ST_GeomFromText('POINT (0 0)'),4674))   then
	         --raise notice 'Distance: %',  ST_Distance(ST_TRANSFORM(aux_geom, 31983),ST_TRANSFORM(i.localizacao, 31983));
	         arr_geom:= array_append(arr_geom,i.localizacao);
	         aux_geom:= i.localizacao;
	         ids:= array_append(ids,i.id);
	         dates:= array_append(dates,i.date);
	    end if;
    	
    end loop;
end;
$function$
;
