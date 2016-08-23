<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateHallsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('halls', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('owner_id')->index();
            $table->string('name');
            $table->string('desc');
            $table->string('idcode');
            $table->string('pass');
            $table->integer('minhr')->default(0);
            $table->integer('maxhr')->default(0);
            $table->integer('onquest')->default(0);
            $table->integer('full')->default(0);
            $table->integer('private')->default(0);
            $table->timestamp('scheduled_for');
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('halls');
    }
}
