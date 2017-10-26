USE [BZ2017]
GO

/****** Object:  StoredProcedure [dbo].[Get_FUJI_Detail]    Script Date: 07/04/2017 16:43:17 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE proc [dbo].[Get_FUJI_Detail]
@GP_NBR int
as
select mi.MAC_NBR,mi.MAC_NAME,fd.START_DATE,fd.BATCH,fd.MATERIAL,fd.YEILD into #t1 from MACHINE_INFO mi left join FUJI_DETAIL fd on mi.MAC_NBR = fd.MAC_NBR
where mi.GP_NBR=@GP_NBR

select t.*  from #t1 t where NOT exists (select 1 from #t1 b where b.MAC_NAME = t.MAC_NAME and b.START_DATE>t.START_DATE) 

drop table #t1
GO

